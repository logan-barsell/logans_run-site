import api from './api';
import { handleServiceError } from '../utils/errorHandler';

// Music Players Management
export const addPlayer = async playerData => {
  try {
    const response = await api.post('/addPlayer', playerData);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, 'Failed to add music player');
    throw new Error(message);
  }
};

export const updatePlayer = async playerData => {
  try {
    const response = await api.post('/updatePlayer', playerData);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(
      error,
      'Failed to update music player'
    );
    throw new Error(message);
  }
};

export const deletePlayer = async playerId => {
  try {
    const response = await api.get(`/deletePlayer/${playerId}`);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(
      error,
      'Failed to delete music player'
    );
    throw new Error(message);
  }
};
