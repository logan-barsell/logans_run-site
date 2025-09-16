import axios from 'axios';
import * as csrfService from '../../services/csrfService';
import { refreshToken } from '../../services/authService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function getTenantIdFromRuntime() {
  if (typeof window === 'undefined') return null;
  // In dev, allow ?tenant= override to propagate into client requests
  const url = new URL(window.location.href);
  const override = url.searchParams.get('tenant');
  if (override) return override;
  // Optionally parse subdomain; we may replace later with TenantProvider
  const host = window.location.host || '';
  if (host.includes('localhost')) return null;
  const hostNoPort = host.split(':')[0];
  const parts = hostNoPort.split('.');
  if (parts.length > 2) return parts[0];
  return null;
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor to add CSRF tokens and tenant ID
api.interceptors.request.use(
  async config => {
    // Add tenant ID
    const tenantId = getTenantIdFromRuntime();
    if (tenantId) config.headers['x-tenant-id'] = tenantId;

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
api.interceptors.response.use(
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

    // Handle 401 errors - attempt token refresh (but not for auth endpoints)
    const isAuthEndpoint = originalRequest.url?.includes('/auth/');

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        await refreshToken();

        // Retry the original request with new tokens
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - check if it's a permanent failure (not just expired tokens)
        const isPermanentFailure =
          refreshError.response?.status === 401 ||
          refreshError.message?.includes('Refresh token required') ||
          refreshError.message?.includes('Invalid refresh token');

        if (isPermanentFailure) {
          // Permanent failure - redirect to login
          console.warn('Permanent token failure, redirecting to login');
          if (typeof window !== 'undefined') {
            window.location.href = '/signin';
          }
        }

        // For temporary failures or network issues, reject without redirect
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
