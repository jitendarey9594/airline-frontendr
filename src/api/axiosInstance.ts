import axios from 'axios';
import { getToken, clearToken } from '../utils/tokenUtils';

const baseURL = (import.meta as any)?.env?.VITE_API_BASE_URL || (import.meta as any)?.env?.VITE_API_BASE || 'http://localhost:8085';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(config => {
  const token = getToken();

  if (!config.headers) {
    config.headers = {} as any;
  }

  if (token) {
    (config.headers as any)['Authorization'] = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor to handle authentication errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('🔍 Response interceptor - Error status:', error.response?.status);
    console.log('🔍 Response interceptor - Error message:', error.response?.data?.message);

    // Only redirect on authentication/authorization errors, not validation errors
    if (error.response?.status === 401) {
      console.log('🚨 401 Unauthorized - clearing token and redirecting');
      // Token is invalid or expired
      clearToken();
      // Redirect to login page
      window.location.href = '/login';
    }
    // For 403 errors, check if it's an auth issue vs validation issue
    if (error.response?.status === 403) {
      const errorMessage = error.response?.data?.message || '';
      console.log('🚨 403 Forbidden - Error message:', errorMessage);
      // Only redirect if it's clearly an authentication issue
      if (errorMessage.toLowerCase().includes('unauthorized') ||
          errorMessage.toLowerCase().includes('forbidden') ||
          errorMessage.toLowerCase().includes('token') ||
          errorMessage.toLowerCase().includes('access denied')) {
        console.log('🚨 Auth-related 403 - clearing token and redirecting');
        clearToken();
        window.location.href = '/login';
      } else {
        console.log('📝 Data validation 403 - not redirecting');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
