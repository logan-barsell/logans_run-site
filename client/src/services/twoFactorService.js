import api from './api';

/**
 * Get 2FA status for current user
 */
export const getTwoFactorStatus = async () => {
  const response = await api.get('/2fa/status');
  return response.data;
};

/**
 * Enable 2FA for current user
 */
export const enableTwoFactor = async () => {
  const response = await api.post('/2fa/enable');
  return response.data;
};

/**
 * Disable 2FA for current user
 */
export const disableTwoFactor = async () => {
  const response = await api.post('/2fa/disable');
  return response.data;
};

/**
 * Send 2FA code to user's email
 */
export const sendTwoFactorCode = async (bandName = 'Bandsyte') => {
  const response = await api.post('/2fa/send-code', {
    bandName,
  });
  return response.data;
};

/**
 * Verify 2FA code
 */
export const verifyTwoFactorCode = async code => {
  const response = await api.post('/2fa/verify-code', {
    code,
  });
  return response.data;
};
