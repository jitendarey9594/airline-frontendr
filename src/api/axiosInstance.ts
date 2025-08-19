import axios from 'axios';
import { getToken } from '../utils/tokenUtils';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8085',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(config => {
  const token = getToken();

  if (!config.headers) {
    config.headers = {};
  }

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;
