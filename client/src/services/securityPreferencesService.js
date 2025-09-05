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
    const errorData = handleServiceError(error, {
      operation: 'getSecurityPreferences',
      customMessage:
        'Unable to load security preferences. Please try again later.',
    });
    throw errorData;
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
    const errorData = handleServiceError(error, {
      operation: 'updateSecurityPreferences',
      customMessage: 'Failed to update security preferences. Please try again.',
    });
    throw errorData;
  }
};
