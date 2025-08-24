import api from './api';
import { handleServiceError } from '../utils/errorHandler';

// Fetch Public Contact Info
export const getContactInfo = async () => {
  try {
    const response = await api.get('/getContactInfo');
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(
      error,
      'Failed to load contact information'
    );
    throw new Error(message);
  }
};

// Update Public Contact Info
export const updateContact = async contactData => {
  try {
    const response = await api.post('/updateContact', contactData);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(
      error,
      'Failed to update contact information'
    );
    throw new Error(message);
  }
};
