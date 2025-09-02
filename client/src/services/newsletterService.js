import api from './api';

// Newsletter signup
export const signupNewsletter = async email => {
  try {
    const response = await api.post('/newsletter/signup', { email });
    return response.data; // Return full response for success/error handling
  } catch (error) {
    throw error;
  }
};

// Get newsletter statistics
export const getNewsletterStats = async () => {
  try {
    const response = await api.get('/newsletter/stats');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch newsletter statistics');
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
    throw new Error('Failed to fetch newsletter subscribers');
  }
};
