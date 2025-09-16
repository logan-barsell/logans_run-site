import api from './api';
import { handleServiceError } from '../lib/errorHandler';

// Members Management
export const addMember = async memberData => {
  try {
    const response = await api.post('/addMember', memberData);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const errorData = handleServiceError(error, {
      operation: 'addMember',
      customMessage: 'Failed to add member. Please try again.',
    });
    throw errorData;
  }
};

export const updateMember = async (memberId, memberData) => {
  try {
    const response = await api.post(`/updateMember/${memberId}`, memberData);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const errorData = handleServiceError(error, {
      operation: 'updateMember',
      customMessage: 'Failed to update member. Please try again.',
    });
    throw errorData;
  }
};

export const deleteMember = async memberId => {
  try {
    const response = await api.get(`/deleteMember/${memberId}`);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const errorData = handleServiceError(error, {
      operation: 'deleteMember',
      customMessage: 'Failed to delete member. Please try again.',
    });
    throw errorData;
  }
};
