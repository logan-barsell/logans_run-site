import api from './api';
import { handleServiceError } from '../lib/errorHandler';

// Fetch Shows
export const getShows = async () => {
  try {
    const response = await api.get('/shows');
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const errorData = handleServiceError(error, {
      operation: 'getShows',
      customMessage: 'Unable to load shows. Please try again later.',
    });
    throw errorData;
  }
};

// Shows Management
export const addShow = async showData => {
  try {
    const response = await api.post('/addShow', showData);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const errorData = handleServiceError(error, {
      operation: 'addShow',
      customMessage: 'Failed to add show. Please try again.',
    });
    throw errorData;
  }
};

export const updateShow = async (showId, showData) => {
  try {
    const response = await api.post(`/updateShow/${showId}`, showData);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const errorData = handleServiceError(error, {
      operation: 'updateShow',
      customMessage: 'Failed to update show. Please try again.',
    });
    throw errorData;
  }
};

export const deleteShow = async showId => {
  try {
    const response = await api.get(`/deleteShow/${showId}`);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const errorData = handleServiceError(error, {
      operation: 'deleteShow',
      customMessage: 'Failed to delete show. Please try again.',
    });
    throw errorData;
  }
};

// Fetch Shows Settings
export const getShowsSettings = async () => {
  try {
    const response = await api.get('/showsSettings');
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const errorData = handleServiceError(error, {
      operation: 'getShowsSettings',
      customMessage: 'Unable to load shows settings. Please try again later.',
    });
    throw errorData;
  }
};

// Update Shows Settings
export const updateShowsSettings = async settings => {
  try {
    const response = await api.post('/updateShowsSettings', settings);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const errorData = handleServiceError(error, {
      operation: 'updateShowsSettings',
      customMessage: 'Failed to update shows settings. Please try again.',
    });
    throw errorData;
  }
};
