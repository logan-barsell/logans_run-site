import api from './api';
import { handleServiceError } from '../lib/errorHandler';

// Fetch Home Images (carousel)
export const getHomeImages = async () => {
  try {
    const response = await api.get('/getHomeImages');
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const errorData = handleServiceError(error, {
      operation: 'getHomeImages',
      customMessage:
        'Unable to load carousel images. Please try refreshing the page.',
    });
    throw errorData;
  }
};

// Home Images (Carousel) Management
export const uploadHomeImage = async imageData => {
  try {
    const response = await api.post('/addHomeImage', imageData);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const errorData = handleServiceError(error, {
      operation: 'uploadHomeImage',
      customMessage: 'Failed to upload home image. Please try again.',
    });
    throw errorData;
  }
};

export const removeHomeImage = async imageId => {
  try {
    const response = await api.get(`/removeImage/${imageId}`);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const errorData = handleServiceError(error, {
      operation: 'removeHomeImage',
      customMessage: 'Failed to remove home image. Please try again.',
    });
    throw errorData;
  }
};
