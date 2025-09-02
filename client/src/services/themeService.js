import api from './api';
import { handleServiceError } from '../utils/errorHandler';

// Fetch Theme
export const getTheme = async () => {
  try {
    const response = await api.get('/theme');
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'getTheme',
    });
    throw new Error(message);
  }
};

// Update Theme
export const updateTheme = async themeData => {
  try {
    const response = await api.post('/updateTheme', themeData);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'updateTheme',
    });
    throw new Error(message);
  }
};
