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

// Send Contact Form Message
export const sendContactMessage = async contactData => {
  try {
    const response = await api.post('/send-message', contactData);
    return response.data; // Return full response for success/error handling
  } catch (error) {
    const { message } = handleServiceError(error, 'Failed to send message');
    throw new Error(message);
  }
};

// Newsletter Signup
export const signupNewsletter = async email => {
  try {
    const response = await api.post('/newsletter-signup', { email });
    return response.data; // Return full response for success/error handling
  } catch (error) {
    const { message } = handleServiceError(
      error,
      'Failed to subscribe to newsletter'
    );
    throw new Error(message);
  }
};
