import api from './api';
import { handleServiceError } from '../utils/errorHandler';

// Get current user information (now uses /auth/me)
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(
      error,
      'Failed to load user information'
    );
    throw new Error(message);
  }
};

// Update user information
export const updateUser = async userData => {
  try {
    const response = await api.put('/user/me', userData);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(
      error,
      'Failed to update user information'
    );
    throw new Error(message);
  }
};

// Initialize default user
export const initializeDefaultUser = async () => {
  try {
    const response = await api.post('/auth/initialize');
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(
      error,
      'Failed to initialize default user'
    );
    throw new Error(message);
  }
};
