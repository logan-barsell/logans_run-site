import api from './api';
import { handleServiceError } from '../utils/errorHandler';

/**
 * Get 2FA status for current user
 */
export const getTwoFactorStatus = async () => {
  try {
    const response = await api.get('/2fa/status');
    return response.data;
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'getTwoFactorStatus',
    });
    throw new Error(message);
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
    const { message } = handleServiceError(error, {
      operation: 'enableTwoFactor',
    });
    throw new Error(message);
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
    const { message } = handleServiceError(error, {
      operation: 'disableTwoFactor',
    });
    throw new Error(message);
  }
};

/**
 * Send 2FA code to user's email
 */
export const sendTwoFactorCode = async (bandName = 'Bandsyte') => {
  try {
    const response = await api.post('/2fa/send-code', {
      bandName,
    });
    return response.data;
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'sendTwoFactorCode',
    });
    throw new Error(message);
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
    const { message } = handleServiceError(error, {
      operation: 'verifyTwoFactorCode',
    });
    throw new Error(message);
  }
};
