import api from './api';
import { handleServiceError } from '../utils/errorHandler';

// Fetch Theme
export const getTheme = async () => {
  try {
    const response = await api.get('/theme');
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(
      error,
      'Failed to load theme settings'
    );
    throw new Error(message);
  }
};

// Update Theme
export const updateTheme = async themeData => {
  try {
    const response = await api.post('/updateTheme', themeData);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(
      error,
      'Failed to update theme settings'
    );
    throw new Error(message);
  }
};
