import api from './api';
import { handleServiceError } from '../utils/errorHandler';

// Newsletter signup
export const signupNewsletter = async email => {
  try {
    const response = await api.post('/newsletter/signup', { email });
    return response.data; // Return full response for success/error handling
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'signupNewsletter',
    });
    throw new Error(message);
  }
};

// Get newsletter statistics
export const getNewsletterStats = async () => {
  try {
    const response = await api.get('/newsletter/stats');
    return response.data;
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'getNewsletterStats',
    });
    throw new Error(message);
  }
};

// Get all newsletter subscribers with pagination
export const getNewsletterSubscribers = async (page = 1, limit = 20) => {
  try {
    const response = await api.get(
      `/newsletter/subscribers?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'getNewsletterSubscribers',
    });
    throw new Error(message);
  }
};
