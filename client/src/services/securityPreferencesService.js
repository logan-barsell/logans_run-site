import api from './api';

/**
 * Get security preferences for the authenticated user
 */
export const getSecurityPreferences = async () => {
  try {
    const response = await api.get('/security-preferences');
    return response.data;
  } catch (error) {
    console.error('Error getting security preferences:', error);
    throw error;
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
    console.error('Error updating security preferences:', error);
    throw error;
  }
};
