import api from './api';
import { handleServiceError } from '../utils/errorHandler';

// Fetch Media Images
export const getMediaImages = async () => {
  try {
    const response = await api.get('/getMediaImages');
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(
      error,
      'Failed to load media images'
    );
    throw new Error(message);
  }
};

// Fetch Videos
export const getVideos = async () => {
  try {
    const response = await api.get('/getVideos');
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, 'Failed to load videos');
    throw new Error(message);
  }
};
