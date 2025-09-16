import api from './api';
import { handleServiceError } from '../lib/errorHandler';

/**
 * Get user sessions
 */
export const getSessions = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(
      `/user/sessions?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    const errorData = handleServiceError(error, {
      operation: 'getSessions',
      customMessage: 'Unable to load user sessions. Please try again later.',
    });
    throw errorData;
  }
};

/**
 * End a specific session
 */
export const endSession = async sessionId => {
  try {
    const response = await api.delete(`/user/sessions/${sessionId}`);
    return response.data;
  } catch (error) {
    const errorData = handleServiceError(error, {
      operation: 'endSession',
      customMessage: 'Failed to end session. Please try again.',
    });
    throw errorData;
  }
};

/**
 * End all other sessions (keep current one)
 */
export const endAllOtherSessions = async () => {
  try {
    const response = await api.delete('/user/sessions');
    return response.data;
  } catch (error) {
    const errorData = handleServiceError(error, {
      operation: 'endAllOtherSessions',
      customMessage: 'Failed to end other sessions. Please try again.',
    });
    throw errorData;
  }
};
