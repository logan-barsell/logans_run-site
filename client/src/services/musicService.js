import api from './api';
import { handleServiceError } from '../utils/errorHandler';

// Fetch Music Players
export const getPlayers = async () => {
  try {
    const response = await api.get('/getPlayers');
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(
      error,
      'Failed to load music players'
    );
    throw new Error(message);
  }
};
