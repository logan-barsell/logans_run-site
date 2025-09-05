import api from './api';
import { handleServiceError } from '../utils/errorHandler';

// Fetch Music Players
export const getPlayers = async () => {
  try {
    const response = await api.get('/getPlayers');
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const errorData = handleServiceError(error, {
      operation: 'getPlayers',
      customMessage: 'Unable to load music content. Please try again later.',
    });
    throw errorData;
  }
};

// Music Players Management
export const addPlayer = async playerData => {
  try {
    const response = await api.post('/addPlayer', playerData);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'addPlayer',
    });
    throw new Error(message);
  }
};

export const updatePlayer = async playerData => {
  try {
    const response = await api.post('/updatePlayer', playerData);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'updatePlayer',
    });
    throw new Error(message);
  }
};

export const deletePlayer = async playerId => {
  try {
    const response = await api.get(`/deletePlayer/${playerId}`);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'deletePlayer',
    });
    throw new Error(message);
  }
};
