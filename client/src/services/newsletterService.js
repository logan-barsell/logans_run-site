import api from './api';
import { handleServiceError } from '../utils/errorHandler';

// Newsletter signup
export const signupNewsletter = async email => {
  try {
    const response = await api.post('/newsletter/signup', { email });
    return response.data; // Return full response for success/error handling
  } catch (error) {
    const errorData = handleServiceError(error, {
      operation: 'signupNewsletter',
      customMessage: 'Failed to subscribe to newsletter. Please try again.',
    });
    throw errorData;
  }
};

// Get newsletter statistics
export const getNewsletterStats = async () => {
  try {
    const response = await api.get('/newsletter/stats');
    return response.data;
  } catch (error) {
    const errorData = handleServiceError(error, {
      operation: 'getNewsletterStats',
      customMessage:
        'Unable to load newsletter statistics. Please try again later.',
    });
    throw errorData;
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
    const errorData = handleServiceError(error, {
      operation: 'getNewsletterSubscribers',
      customMessage:
        'Unable to load newsletter subscribers. Please try again later.',
    });
    throw errorData;
  }
};

// Admin unsubscribe a subscriber
export const unsubscribeSubscriber = async subscriberId => {
  try {
    const response = await api.post(
      `/newsletter/subscribers/${subscriberId}/unsubscribe`
    );
    return response.data;
  } catch (error) {
    const errorData = handleServiceError(error, {
      operation: 'unsubscribeSubscriber',
      customMessage: 'Failed to unsubscribe subscriber. Please try again.',
    });
    throw errorData;
  }
};
