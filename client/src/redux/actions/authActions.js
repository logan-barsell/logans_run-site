import { checkAuth } from '../../services/authService';

// Action Types
export const AUTH_LOADING = 'AUTH_LOADING';
export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const AUTH_ERROR = 'AUTH_ERROR';
export const LOGOUT = 'LOGOUT';
export const UPDATE_USER = 'UPDATE_USER';

// Action Creators
export const authLoading = () => ({
  type: AUTH_LOADING,
});

export const authSuccess = user => ({
  type: AUTH_SUCCESS,
  payload: user,
});

export const authError = error => ({
  type: AUTH_ERROR,
  payload: error,
});

export const logout = () => ({
  type: LOGOUT,
});

export const updateUser = user => ({
  type: UPDATE_USER,
  payload: user,
});

// Thunk Actions
export const checkAuthentication = () => async dispatch => {
  try {
    dispatch(authLoading());
    const response = await checkAuth();

    if (response.success && response.data) {
      dispatch(authSuccess(response.data));
      return true;
    } else {
      dispatch(authError('Authentication failed'));
      return false;
    }
  } catch (error) {
    dispatch(authError(error.message));
    return false;
  }
};

export const refreshUserData = () => async dispatch => {
  try {
    const response = await checkAuth();

    if (response.success && response.data) {
      dispatch(updateUser(response.data));
      return response.data;
    } else {
      throw new Error('Failed to refresh user data');
    }
  } catch (error) {
    console.error('Error refreshing user data:', error);
    throw error;
  }
};
