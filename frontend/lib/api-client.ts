import axios from 'axios';
import { API_BASE_URL } from './config';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle global error responses
    if (error.response?.status === 404) {
      console.error('Resource not found');
    } else if (error.response?.status >= 500) {
      console.error('Server error occurred');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
