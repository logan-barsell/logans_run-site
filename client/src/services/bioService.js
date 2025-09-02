import api from './api';
import { handleServiceError } from '../utils/errorHandler';

// Fetch Bio
export const getBio = async () => {
  try {
    const response = await api.get('/bio');
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'getBio',
    });
    throw new Error(message);
  }
};

// Update Bio
export const updateBio = async bioData => {
  try {
    const response = await api.post('/updateBio', bioData);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'updateBio',
    });
    throw new Error(message);
  }
};

// Fetch Members
export const getMembers = async () => {
  try {
    const response = await api.get('/members');
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'getMembers',
    });
    throw new Error(message);
  }
};
