import api from './api';
import { handleServiceError } from '../utils/errorHandler';

// Shows Management
export const addShow = async showData => {
  try {
    const response = await api.post('/addShow', showData);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, 'Failed to add show');
    throw new Error(message);
  }
};

export const updateShow = async (showId, showData) => {
  try {
    const response = await api.post(`/updateShow/${showId}`, showData);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, 'Failed to update show');
    throw new Error(message);
  }
};

export const deleteShow = async showId => {
  try {
    const response = await api.get(`/deleteShow/${showId}`);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, 'Failed to delete show');
    throw new Error(message);
  }
};
