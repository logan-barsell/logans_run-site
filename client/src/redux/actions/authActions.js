import {
  checkAuth,
  completeTwoFactor,
  sendTwoFactorCode,
} from '../../services/authService';
import {
  AUTH_LOADING,
  AUTH_SUCCESS,
  AUTH_ERROR,
  LOGOUT,
  UPDATE_USER,
  LOGIN_LOADING,
  COMPLETE_TWO_FACTOR,
  COMPLETE_TWO_FACTOR_LOADING,
  COMPLETE_TWO_FACTOR_ERROR,
  SEND_TWO_FACTOR_CODE,
  SEND_TWO_FACTOR_CODE_LOADING,
  SEND_TWO_FACTOR_CODE_ERROR,
} from './types';

// Action Creators
export const authLoading = () => ({
  type: AUTH_LOADING,
});

export const loginLoading = () => ({
  type: LOGIN_LOADING,
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

// 2FA Action Creators
export const completeTwoFactorLoading = () => ({
  type: COMPLETE_TWO_FACTOR_LOADING,
});

export const completeTwoFactorSuccess = user => ({
  type: COMPLETE_TWO_FACTOR,
  payload: user,
});

export const completeTwoFactorError = error => ({
  type: COMPLETE_TWO_FACTOR_ERROR,
  payload: error,
});

export const sendTwoFactorCodeLoading = () => ({
  type: SEND_TWO_FACTOR_CODE_LOADING,
});

export const sendTwoFactorCodeSuccess = () => ({
  type: SEND_TWO_FACTOR_CODE,
});

export const sendTwoFactorCodeError = error => ({
  type: SEND_TWO_FACTOR_CODE_ERROR,
  payload: error,
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
      // Don't dispatch error for unauthenticated users - this is expected
      dispatch(authError(null));
      return false;
    }
  } catch (error) {
    // Don't dispatch error for unauthenticated users - this is expected
    dispatch(authError(null));
    return false;
  }
};

export const loginUser = credentials => async dispatch => {
  try {
    const { login } = await import('../../services/authService');

    dispatch(loginLoading());
    const response = await login(credentials);

    if (response.success) {
      if (response.requiresTwoFactor) {
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

// 2FA Thunk Actions
export const completeTwoFactorAuth = (userId, code) => async dispatch => {
  try {
    dispatch(completeTwoFactorLoading());
    const response = await completeTwoFactor(userId, code);

    if (response.success) {
      dispatch(completeTwoFactorSuccess(response.data.user));
      return {
        success: true,
        message: response.message,
      };
    } else {
      dispatch(
        completeTwoFactorError(response.message || '2FA verification failed')
      );
      return {
        success: false,
        error: response.message || '2FA verification failed',
      };
    }
  } catch (error) {
    dispatch(
      completeTwoFactorError(error.message || '2FA verification failed')
    );
    return {
      success: false,
      error: error.message || '2FA verification failed',
    };
  }
};

export const resendTwoFactorCode =
  (userId, tenantId, bandName) => async dispatch => {
    try {
      dispatch(sendTwoFactorCodeLoading());
      const response = await sendTwoFactorCode(userId, tenantId, bandName);

      if (response.success) {
        dispatch(sendTwoFactorCodeSuccess());
        return {
          success: true,
          message: response.message || 'New verification code sent',
        };
      } else {
        dispatch(
          sendTwoFactorCodeError(response.message || 'Failed to send code')
        );
        return {
          success: false,
          error: response.message || 'Failed to send code',
        };
      }
    } catch (error) {
      dispatch(sendTwoFactorCodeError(error.message || 'Failed to send code'));
      return {
        success: false,
        error: error.message || 'Failed to send code',
      };
    }
  };
