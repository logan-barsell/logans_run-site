import api from './api';
import { handleServiceError } from '../utils/errorHandler';

// Fetch Bio
export const getBio = async () => {
  try {
    const response = await api.get('/bio');
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const errorData = handleServiceError(error, {
      operation: 'getBio',
      customMessage: 'Unable to load bio information. Please try again later.',
    });
    throw errorData;
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
    const errorData = handleServiceError(error, {
      operation: 'getMembers',
      customMessage:
        'Unable to load member information. Please try again later.',
    });
    throw errorData;
  }
};
