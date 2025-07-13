import api from './api';
import { handleServiceError } from '../utils/errorHandler';

// Fetch Home Images (carousel)
export const getHomeImages = async () => {
  try {
    const response = await api.get('/getHomeImages');
    return response.data;
  } catch (error) {
    const { message } = handleServiceError(
      error,
      'Failed to fetch home images'
    );
    throw new Error(message);
  }
};
