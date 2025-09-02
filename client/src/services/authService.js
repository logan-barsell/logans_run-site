import api from './api';
import authApiClient from './authApiClient';
import { handleServiceError } from '../utils/errorHandler';

// Authentication
export const checkAuth = async () => {
  try {
    const response = await authApiClient.get('/auth/me');
    return response.data; // Extract user data from response
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'checkAuth',
    });
    throw new Error(message);
  }
};

export const login = async credentials => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'login',
    });
    throw new Error(message);
  }
};

export const signup = async userData => {
  try {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'signup',
    });
    throw new Error(message);
  }
};

export const logout = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'logout',
    });
    throw new Error(message);
  }
};

export const refreshToken = async () => {
  try {
    const response = await authApiClient.post('/auth/refresh');
    return response.data;
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'refreshToken',
    });
    throw new Error(message);
  }
};

export const requestPasswordReset = async email => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'requestPasswordReset',
    });
    throw new Error(message);
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post('/auth/reset-password', {
      token,
      newPassword,
    });
    return response.data;
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'resetPassword',
    });
    throw new Error(message);
  }
};

export const verifyEmail = async token => {
  try {
    const response = await api.get(`/auth/verify-email?token=${token}`);
    return response.data;
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'verifyEmail',
    });
    throw new Error(message);
  }
};

export const resendEmailVerification = async email => {
  try {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'resendEmailVerification',
    });
    throw new Error(message);
  }
};
