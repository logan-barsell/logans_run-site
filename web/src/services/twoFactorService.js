import api from './api';
import { handleServiceError } from '../lib/errorHandler';

/**
 * Get 2FA status for current user
 */
export const getTwoFactorStatus = async () => {
  try {
    const response = await api.get('/2fa/status');
    return response.data;
  } catch (error) {
    const errorData = handleServiceError(error, {
      operation: 'getTwoFactorStatus',
      customMessage:
        'Unable to load two-factor authentication status. Please try again later.',
    });
    throw errorData;
  }
};

/**
 * Enable 2FA for current user
 */
export const enableTwoFactor = async () => {
  try {
    const response = await api.post('/2fa/enable');
    return response.data;
  } catch (error) {
    const errorData = handleServiceError(error, {
      operation: 'enableTwoFactor',
      customMessage:
        'Failed to enable two-factor authentication. Please try again.',
    });
    throw errorData;
  }
};

/**
 * Disable 2FA for current user
 */
export const disableTwoFactor = async () => {
  try {
    const response = await api.post('/2fa/disable');
    return response.data;
  } catch (error) {
    const errorData = handleServiceError(error, {
      operation: 'disableTwoFactor',
      customMessage:
        'Failed to disable two-factor authentication. Please try again.',
    });
    throw errorData;
  }
};

/**
 * Send 2FA code to user's email
 */
export const sendTwoFactorCode = async (bandName = 'Bandsyte') => {
  try {
    const response = await api.post('/2fa/send-code', {
      siteTitle: bandName, // Using siteTitle as the band name field
    });
    return response.data;
  } catch (error) {
    const errorData = handleServiceError(error, {
      operation: 'sendTwoFactorCode',
      customMessage:
        'Failed to send two-factor authentication code. Please try again.',
    });
    throw errorData;
  }
};

/**
 * Verify 2FA code
 */
export const verifyTwoFactorCode = async code => {
  try {
    const response = await api.post('/2fa/verify-code', {
      code,
    });
    return response.data;
  } catch (error) {
    const errorData = handleServiceError(error, {
      operation: 'verifyTwoFactorCode',
      customMessage:
        'Failed to verify two-factor authentication code. Please try again.',
    });
    throw errorData;
  }
};
