import axios from 'axios';
import * as csrfService from './csrfService';
import { refreshToken } from './authService';
import { logout } from '../redux/actions/authActions';
import { store } from '../redux/store';

// You can set REACT_APP_API_BASE_URL in your .env file, or fallback to relative path
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Always include cookies for auth if needed
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add CSRF tokens
apiClient.interceptors.request.use(
  async config => {
    // Skip CSRF for GET requests
    if (config.method?.toLowerCase() === 'get') {
      return config;
    }

    // Skip CSRF in development (matches backend logic)
    if (process.env.NODE_ENV === 'development') {
      return config;
    }

    try {
      // Add CSRF token to headers
      const token = await csrfService.getToken();
      config.headers['X-CSRF-Token'] = token;
    } catch (error) {
      console.warn('Failed to get CSRF token:', error.message);
      // Continue with request even if CSRF token fails
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle CSRF errors and token refresh
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // If CSRF token is invalid, clear it and retry once
    if (
      error.response?.status === 403 &&
      error.response?.data?.message?.includes('CSRF')
    ) {
      csrfService.clearToken();
    }

    // Handle 401 errors - attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        await refreshToken();

        // Retry the original request with new tokens
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout the user
        console.error('Token refresh failed, logging out:', refreshError);
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { apiClient };
export default apiClient;
