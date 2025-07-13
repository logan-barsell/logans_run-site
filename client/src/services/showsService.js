import api from './api';
import { handleServiceError } from '../utils/errorHandler';

// Fetch Shows
export const getShows = async () => {
  try {
    const response = await api.get('/shows');
    return response.data;
  } catch (error) {
    const { message } = handleServiceError(error, 'Failed to load shows');
    throw new Error(message);
  }
};

// Fetch Shows Settings
export const getShowsSettings = async () => {
  try {
    const response = await api.get('/showsSettings');
    return response.data;
  } catch (error) {
    const { message } = handleServiceError(
      error,
      'Failed to load shows settings'
    );
    throw new Error(message);
  }
};

// Update Shows Settings
export const updateShowsSettings = async settings => {
  try {
    const response = await api.post('/updateShowsSettings', settings);
    return response.data;
  } catch (error) {
    const { message } = handleServiceError(
      error,
      'Failed to update shows settings'
    );
    throw new Error(message);
  }
};
