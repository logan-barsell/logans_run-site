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
} from '../actions/types';

const initialState = {
  data: [],
  loading: false,
  error: null,
  deleteLoading: false,
  deleteError: null,
  deleteAllLoading: false,
  deleteAllError: null,
};

export const sessionsReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch sessions
    case FETCH_SESSIONS_LOADING:
      return { ...state, loading: true, error: null };
    case FETCH_SESSIONS:
      return { ...state, data: action.payload, loading: false, error: null };
    case FETCH_SESSIONS_ERROR:
      return { ...state, loading: false, error: action.payload };

    // Delete session
    case DELETE_SESSION_LOADING:
      return { ...state, deleteLoading: true, deleteError: null };
    case DELETE_SESSION:
      return {
        ...state,
        data: state.data.filter(session => session.id !== action.payload.id),
        deleteLoading: false,
        deleteError: null,
      };
    case DELETE_SESSION_ERROR:
      return { ...state, deleteLoading: false, deleteError: action.payload };

    // Delete all sessions
    case DELETE_ALL_SESSIONS_LOADING:
      return { ...state, deleteAllLoading: true, deleteAllError: null };
    case DELETE_ALL_SESSIONS:
      return {
        ...state,
        data: [],
        deleteAllLoading: false,
        deleteAllError: null,
      };
    case DELETE_ALL_SESSIONS_ERROR:
      return {
        ...state,
        deleteAllLoading: false,
        deleteAllError: action.payload,
      };

    default:
      return state;
  }
};
