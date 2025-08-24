import api from './api';
import { handleServiceError } from '../utils/errorHandler';

// Members Management
export const addMember = async memberData => {
  try {
    const response = await api.post('/addMember', memberData);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, 'Failed to add member');
    throw new Error(message);
  }
};

export const updateMember = async (memberId, memberData) => {
  try {
    const response = await api.post(`/updateMember/${memberId}`, memberData);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, 'Failed to update member');
    throw new Error(message);
  }
};

export const deleteMember = async memberId => {
  try {
    const response = await api.get(`/deleteMember/${memberId}`);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, 'Failed to delete member');
    throw new Error(message);
  }
};
