import api from './api';
import { handleServiceError } from '../utils/errorHandler';

// Update user information
export const updateUser = async userData => {
  try {
    const response = await api.put('/user/me', userData);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'updateUser',
    });
    throw new Error(message);
  }
};

// Change user password
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.put('/user/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'changePassword',
    });
    throw new Error(message);
  }
};

// Initialize default user
export const initializeDefaultUser = async () => {
  try {
    const response = await api.post('/auth/initialize');
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'initializeDefaultUser',
    });
    throw new Error(message);
  }
};
