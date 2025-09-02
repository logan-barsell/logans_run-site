import axios from 'axios';
import * as csrfService from './csrfService';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

const authApiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache', // Critical for auth operations
  },
});

// Request interceptor - CSRF protection only (no token refresh)
authApiClient.interceptors.request.use(
  async config => {
    // Skip CSRF for GET requests (matches backend logic)
    if (config.method?.toLowerCase() === 'get') {
      return config;
    }

    // Skip CSRF in development (matches backend logic)
    if (process.env.NODE_ENV === 'development') {
      return config;
    }

    try {
      // Add CSRF token to headers for non-GET requests
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

// Response interceptor - handle CSRF errors only (no token refresh)
authApiClient.interceptors.response.use(
  response => response,
  error => {
    // Handle CSRF token errors by clearing the token
    if (
      error.response?.status === 403 &&
      error.response?.data?.message?.includes('CSRF')
    ) {
      csrfService.clearToken();
    }

    return Promise.reject(error);
  }
);

export default authApiClient;
