import api from './api';
import { handleServiceError } from '../utils/errorHandler';

/**
 * Get security preferences for the authenticated user
 */
export const getSecurityPreferences = async () => {
  try {
    const response = await api.get('/security-preferences');
    return response.data;
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'getSecurityPreferences',
    });
    throw new Error(message);
  }
};

/**
 * Update security preferences for the authenticated user
 */
export const updateSecurityPreferences = async preferences => {
  try {
    const response = await api.put('/security-preferences', preferences);
    return response.data;
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'updateSecurityPreferences',
    });
    throw new Error(message);
  }
};
