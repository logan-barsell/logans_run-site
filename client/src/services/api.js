import axios from 'axios';
import csrfService from './csrfService';

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

// Response interceptor to handle CSRF errors
apiClient.interceptors.response.use(
  response => response,
  error => {
    // If CSRF token is invalid, clear it and retry once
    if (
      error.response?.status === 403 &&
      error.response?.data?.message?.includes('CSRF')
    ) {
      csrfService.clearToken();

      // Optionally retry the request once with a new token
      // For now, just clear the token and let the user retry
    }

    return Promise.reject(error);
  }
);

export { apiClient };
export default apiClient;
