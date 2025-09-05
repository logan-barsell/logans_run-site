import api from './api';
import { handleServiceError } from '../utils/errorHandler';

// Fetch Public Contact Info
export const getContactInfo = async () => {
  try {
    const response = await api.get('/getContactInfo');
    return response.data.data; // Extract data from { success: true, data: {...} }
  } catch (error) {
    const errorData = handleServiceError(error, {
      operation: 'getContactInfo',
      customMessage:
        'Unable to load contact information. Please try again later.',
    });
    throw errorData;
  }
};

// Update Public Contact Info
export const updateContact = async contactData => {
  try {
    const response = await api.put('/updateContact', contactData);
    return response.data.data; // Extract data from { success: true, data: {...} }
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'updateContact',
    });
    throw new Error(message);
  }
};

// Send Contact Form Message
export const sendContactMessage = async contactData => {
  try {
    const response = await api.post('/send-message', contactData);
    return response.data; // Return full response for success/error handling
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'sendContactMessage',
    });
    throw new Error(message);
  }
};
