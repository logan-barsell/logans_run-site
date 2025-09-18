import api from './api';
import authApiClient from './authApiClient';
import { handleServiceError } from '../lib/errorHandler';

// Authentication
export const checkAuth = async () => {
  try {
    const response = await authApiClient.get('/auth/me');
    return response.data; // Extract user data from response
  } catch (error) {
    const errorData = handleServiceError(error, {
      operation: 'checkAuth',
      customMessage: 'Unable to verify authentication. Please try again later.',
    });
    throw errorData;
  }
};

export const login = async credentials => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    const errorData = handleServiceError(error, {
      operation: 'login',
      customMessage:
        'Login failed. Please check your credentials and try again.',
    });
    throw errorData;
  }
};

export const signup = async userData => {
  try {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  } catch (error) {
    const errorData = handleServiceError(error, {
      operation: 'signup',
      customMessage:
        'Signup failed. Please check your information and try again.',
    });
    throw errorData;
  }
};

export const logout = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error) {
    const errorData = handleServiceError(error, {
      operation: 'logout',
      customMessage: 'Logout failed. Please try again.',
    });
    throw errorData;
  }
};

export const refreshToken = async () => {
  try {
    const response = await authApiClient.post('/auth/refresh');
    return response.data;
  } catch (error) {
    const errorData = handleServiceError(error, {
      operation: 'refreshToken',
      customMessage: 'Token refresh failed. Please log in again.',
    });
    throw errorData;
  }
};

export const requestPasswordReset = async email => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    const errorData = handleServiceError(error, {
      operation: 'requestPasswordReset',
      customMessage: 'Failed to send password reset email. Please try again.',
    });
    throw errorData;
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
    const errorData = handleServiceError(error, {
      operation: 'resetPassword',
      customMessage: 'Failed to reset password. Please try again.',
    });
    throw errorData;
  }
};

export const verifyEmail = async token => {
  try {
    const response = await api.get(`/auth/verify-email?token=${token}`);
    return response.data;
  } catch (error) {
    const errorData = handleServiceError(error, {
      operation: 'verifyEmail',
      customMessage: 'Failed to verify email. Please try again.',
    });
    throw errorData;
  }
};

export const resendEmailVerification = async email => {
  try {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  } catch (error) {
    const errorData = handleServiceError(error, {
      operation: 'resendEmailVerification',
      customMessage: 'Failed to resend email verification. Please try again.',
    });
    throw errorData;
  }
};

export const completeTwoFactor = async (userId, code) => {
  try {
    const response = await api.post('/auth/complete-2fa', {
      userId,
      code,
    });
    return response.data;
  } catch (error) {
    const errorData = handleServiceError(error, {
      operation: 'completeTwoFactor',
      customMessage: 'Failed to verify 2FA code. Please try again.',
    });
    throw errorData;
  }
};

export const sendTwoFactorCode = async (userId, tenantId, bandName) => {
  try {
    const response = await api.post('/2fa/send-code', {
      userId,
      tenantId,
      siteTitle: bandName, // Using siteTitle as the band name field
    });
    return response.data;
  } catch (error) {
    const errorData = handleServiceError(error, {
      operation: 'sendTwoFactorCode',
      customMessage: 'Failed to send 2FA code. Please try again.',
    });
    throw errorData;
  }
};
