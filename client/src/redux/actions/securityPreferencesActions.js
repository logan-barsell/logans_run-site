import {
  FETCH_SECURITY_PREFERENCES,
  FETCH_SECURITY_PREFERENCES_LOADING,
  FETCH_SECURITY_PREFERENCES_ERROR,
  UPDATE_SECURITY_PREFERENCES,
  UPDATE_SECURITY_PREFERENCES_LOADING,
  UPDATE_SECURITY_PREFERENCES_ERROR,
} from './types';
import {
  getSecurityPreferences,
  updateSecurityPreferences,
} from '../../services/securityPreferencesService';

// Fetch security preferences
export const fetchSecurityPreferences = () => async dispatch => {
  dispatch({ type: FETCH_SECURITY_PREFERENCES_LOADING });
  try {
    const response = await getSecurityPreferences();
    // Extract the data from the API response
    const data = response.success ? response.data : response;
    dispatch({ type: FETCH_SECURITY_PREFERENCES, payload: data });
  } catch (errorData) {
    dispatch({ type: FETCH_SECURITY_PREFERENCES_ERROR, payload: errorData });
  }
};

// Update security preferences
export const updateSecurityPreferencesAction =
  preferences => async dispatch => {
    dispatch({ type: UPDATE_SECURITY_PREFERENCES_LOADING });
    try {
      const response = await updateSecurityPreferences(preferences);
      // Extract the data from the API response
      const data = response.success ? response.data : response;
      dispatch({ type: UPDATE_SECURITY_PREFERENCES, payload: data });
      return { success: true, data };
    } catch (errorData) {
      dispatch({ type: UPDATE_SECURITY_PREFERENCES_ERROR, payload: errorData });
      return { success: false, error: errorData };
    }
  };
