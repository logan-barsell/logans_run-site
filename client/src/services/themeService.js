import api from './api';
import { handleServiceError } from '../utils/errorHandler';

// Fetch Theme
export const getTheme = async () => {
  try {
    const response = await api.get('/theme');
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const errorData = handleServiceError(error, {
      operation: 'getTheme',
      customMessage: 'Unable to load theme settings. Please try again later.',
    });
    throw errorData;
  }
};

// Update Theme
export const updateTheme = async themeData => {
  try {
    const response = await api.post('/updateTheme', themeData);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const errorData = handleServiceError(error, {
      operation: 'updateTheme',
      customMessage: 'Failed to update theme settings. Please try again.',
    });
    throw errorData;
  }
};
