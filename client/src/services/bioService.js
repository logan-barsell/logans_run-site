import api from './api';
import { handleServiceError } from '../utils/errorHandler';

// Fetch Bio
export const getBio = async () => {
  try {
    const response = await api.get('/bio');
    return response.data;
  } catch (error) {
    const { message } = handleServiceError(
      error,
      'Failed to load bio information'
    );
    throw new Error(message);
  }
};

// Update Bio
export const updateBio = async bioData => {
  try {
    const response = await api.post('/updateBio', bioData);
    return response.data;
  } catch (error) {
    const { message } = handleServiceError(
      error,
      'Failed to update bio information'
    );
    throw new Error(message);
  }
};

// Fetch Members
export const getMembers = async () => {
  try {
    const response = await api.get('/members');
    return response.data;
  } catch (error) {
    const { message } = handleServiceError(
      error,
      'Failed to load member information'
    );
    throw new Error(message);
  }
};
