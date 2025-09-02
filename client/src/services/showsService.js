import api from './api';
import { handleServiceError } from '../utils/errorHandler';

// Fetch Shows
export const getShows = async () => {
  try {
    const response = await api.get('/shows');
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'getShows',
    });
    throw new Error(message);
  }
};

// Shows Management
export const addShow = async showData => {
  try {
    const response = await api.post('/addShow', showData);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'addShow',
    });
    throw new Error(message);
  }
};

export const updateShow = async (showId, showData) => {
  try {
    const response = await api.post(`/updateShow/${showId}`, showData);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'updateShow',
    });
    throw new Error(message);
  }
};

export const deleteShow = async showId => {
  try {
    const response = await api.get(`/deleteShow/${showId}`);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'deleteShow',
    });
    throw new Error(message);
  }
};

// Fetch Shows Settings
export const getShowsSettings = async () => {
  try {
    const response = await api.get('/showsSettings');
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'getShowsSettings',
    });
    throw new Error(message);
  }
};

// Update Shows Settings
export const updateShowsSettings = async settings => {
  try {
    const response = await api.post('/updateShowsSettings', settings);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'updateShowsSettings',
    });
    throw new Error(message);
  }
};
