import api from './api';
import { handleServiceError } from '../lib/errorHandler';
import { getCachedDefaultTheme } from '../lib/theme/themeCache';
import { defaultTheme } from '../lib/theme/defaultTheme';

// Fetch Theme
export const getTheme = async () => {
  try {
    const response = await api.get('/theme');
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    // Try to get cached default theme as fallback
    const cachedDefault = getCachedDefaultTheme();
    if (cachedDefault) {
      console.log('🎨 Using cached default theme as fallback');
      return cachedDefault;
    }

    // Final fallback to hardcoded default theme
    console.log('🎨 Using hardcoded default theme as final fallback');
    return defaultTheme;
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
