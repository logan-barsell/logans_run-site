import { checkAuth } from '../../services/authService';
import {
  AUTH_LOADING,
  AUTH_SUCCESS,
  AUTH_ERROR,
  LOGOUT,
  UPDATE_USER,
} from './types';

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

export const loginUser = credentials => async dispatch => {
  try {
    const { login } = await import('../../services/authService');

    dispatch(authLoading());
    const response = await login(credentials);

    if (response.success) {
      if (response.requiresTwoFactor) {
        // Return 2FA data instead of dispatching success
        return {
          success: true,
          requiresTwoFactor: true,
          data: response.data,
          message: response.message,
        };
      } else {
        dispatch(authSuccess(response.data.user));
        return {
          success: true,
          requiresTwoFactor: false,
          message: response.message,
        };
      }
    } else {
      dispatch(authError(response.error || 'Login failed'));
      return {
        success: false,
        error: response.error || 'Login failed',
      };
    }
  } catch (error) {
    dispatch(authError(error.message || 'Login failed'));
    return {
      success: false,
      error: error.message || 'Login failed',
    };
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
