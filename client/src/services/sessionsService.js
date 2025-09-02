import api from './api';
import { handleServiceError } from '../utils/errorHandler';

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
    const { message } = handleServiceError(error, {
      operation: 'getSessions',
    });
    throw new Error(message);
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
    const { message } = handleServiceError(error, {
      operation: 'endSession',
    });
    throw new Error(message);
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
    const { message } = handleServiceError(error, {
      operation: 'endAllOtherSessions',
    });
    throw new Error(message);
  }
};
