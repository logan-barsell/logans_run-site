import api from './api';
import { handleServiceError } from '../lib/errorHandler';

// Update user information
export const updateUser = async userData => {
  try {
    const response = await api.put('/user/me', userData);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const errorData = handleServiceError(error, {
      operation: 'updateUser',
      customMessage: 'Failed to update user information. Please try again.',
    });
    throw errorData;
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
    const errorData = handleServiceError(error, {
      operation: 'changePassword',
      customMessage:
        'Failed to change password. Please check your current password and try again.',
    });
    throw errorData;
  }
};
