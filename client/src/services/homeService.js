import api from './api';
import { handleServiceError } from '../utils/errorHandler';

// Fetch Home Images (carousel)
export const getHomeImages = async () => {
  try {
    const response = await api.get('/getHomeImages');
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'getHomeImages',
    });
    throw new Error(message);
  }
};

// Home Images (Carousel) Management
export const uploadHomeImage = async imageData => {
  try {
    const response = await api.post('/addHomeImage', imageData);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'uploadHomeImage',
    });
    throw new Error(message);
  }
};

export const removeHomeImage = async imageId => {
  try {
    const response = await api.get(`/removeImage/${imageId}`);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'removeHomeImage',
    });
    throw new Error(message);
  }
};
