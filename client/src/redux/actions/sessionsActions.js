import {
  FETCH_SESSIONS,
  FETCH_SESSIONS_LOADING,
  FETCH_SESSIONS_ERROR,
  DELETE_SESSION,
  DELETE_SESSION_LOADING,
  DELETE_SESSION_ERROR,
  DELETE_ALL_SESSIONS,
  DELETE_ALL_SESSIONS_LOADING,
  DELETE_ALL_SESSIONS_ERROR,
} from './types';
import {
  getSessions,
  endSession,
  endAllOtherSessions,
} from '../../services/sessionsService';

// Fetch sessions
export const fetchSessions = () => async dispatch => {
  dispatch({ type: FETCH_SESSIONS_LOADING });
  try {
    const response = await getSessions();
    // Extract the actual sessions array from the response
    // Based on API response: { success: true, data: { sessions: [...], currentSessionId: "...", pagination: {...} } }
    const sessionsData =
      response.data?.sessions || response.sessions || response.data || response;
    const currentSessionId = response.data?.currentSessionId;

    // Add isCurrent property to each session
    const sessions = Array.isArray(sessionsData)
      ? sessionsData.map(session => ({
          ...session,
          isCurrent: session.sessionId === currentSessionId,
        }))
      : [];

    dispatch({
      type: FETCH_SESSIONS,
      payload: sessions,
    });
  } catch (errorData) {
    dispatch({ type: FETCH_SESSIONS_ERROR, payload: errorData });
  }
};

// End session
export const endSessionAction = sessionId => async dispatch => {
  dispatch({ type: DELETE_SESSION_LOADING });
  try {
    const data = await endSession(sessionId);
    dispatch({ type: DELETE_SESSION, payload: data });
    return { success: true, data };
  } catch (errorData) {
    dispatch({ type: DELETE_SESSION_ERROR, payload: errorData });
    return { success: false, error: errorData };
  }
};

// End all other sessions
export const endAllOtherSessionsAction = () => async dispatch => {
  dispatch({ type: DELETE_ALL_SESSIONS_LOADING });
  try {
    const data = await endAllOtherSessions();
    dispatch({ type: DELETE_ALL_SESSIONS, payload: data });
    return { success: true, data };
  } catch (errorData) {
    dispatch({ type: DELETE_ALL_SESSIONS_ERROR, payload: errorData });
    return { success: false, error: errorData };
  }
};
