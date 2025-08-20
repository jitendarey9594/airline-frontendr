import axios from 'axios';
import { getToken, clearToken } from '../utils/tokenUtils';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8085',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(config => {
  const token = getToken();

  console.log('🔍 Request interceptor - Token from localStorage:', token ? 'Present' : 'Missing');
  console.log('🔍 Request URL:', config.url);

  if (!config.headers) {
    config.headers = {};
  }

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
    console.log('✅ Authorization header added');
  } else {
    console.warn('⚠️ No token found - request will be unauthenticated');
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
