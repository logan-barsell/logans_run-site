import {
  FETCH_SECURITY_PREFERENCES,
  FETCH_SECURITY_PREFERENCES_LOADING,
  FETCH_SECURITY_PREFERENCES_ERROR,
  UPDATE_SECURITY_PREFERENCES,
  UPDATE_SECURITY_PREFERENCES_LOADING,
  UPDATE_SECURITY_PREFERENCES_ERROR,
} from '../actions/types';

const initialState = {
  data: null,
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null,
};

export const securityPreferencesReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch security preferences
    case FETCH_SECURITY_PREFERENCES_LOADING:
      return { ...state, loading: true, error: null };
    case FETCH_SECURITY_PREFERENCES:
      return { ...state, data: action.payload, loading: false, error: null };
    case FETCH_SECURITY_PREFERENCES_ERROR:
      return { ...state, loading: false, error: action.payload };

    // Update security preferences
    case UPDATE_SECURITY_PREFERENCES_LOADING:
      return { ...state, updateLoading: true, updateError: null };
    case UPDATE_SECURITY_PREFERENCES:
      return {
        ...state,
        data: action.payload,
        updateLoading: false,
        updateError: null,
      };
    case UPDATE_SECURITY_PREFERENCES_ERROR:
      return { ...state, updateLoading: false, updateError: action.payload };

    default:
      return state;
  }
};
