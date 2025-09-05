import {
  FETCH_TWO_FACTOR_SETTINGS,
  FETCH_TWO_FACTOR_SETTINGS_LOADING,
  FETCH_TWO_FACTOR_SETTINGS_ERROR,
  ENABLE_TWO_FACTOR,
  ENABLE_TWO_FACTOR_LOADING,
  ENABLE_TWO_FACTOR_ERROR,
  DISABLE_TWO_FACTOR,
  DISABLE_TWO_FACTOR_LOADING,
  DISABLE_TWO_FACTOR_ERROR,
  VERIFY_TWO_FACTOR,
  VERIFY_TWO_FACTOR_LOADING,
  VERIFY_TWO_FACTOR_ERROR,
} from './types';
import {
  getTwoFactorStatus,
  enableTwoFactor,
  disableTwoFactor,
  verifyTwoFactorCode,
} from '../../services/twoFactorService';

// Fetch two factor settings
export const fetchTwoFactorSettings = () => async dispatch => {
  dispatch({ type: FETCH_TWO_FACTOR_SETTINGS_LOADING });
  try {
    const data = await getTwoFactorStatus();
    dispatch({ type: FETCH_TWO_FACTOR_SETTINGS, payload: data });
  } catch (errorData) {
    dispatch({ type: FETCH_TWO_FACTOR_SETTINGS_ERROR, payload: errorData });
  }
};

// Enable two factor authentication
export const enableTwoFactorAction = () => async dispatch => {
  dispatch({ type: ENABLE_TWO_FACTOR_LOADING });
  try {
    const data = await enableTwoFactor();
    dispatch({ type: ENABLE_TWO_FACTOR, payload: data });
    return { success: true, data };
  } catch (errorData) {
    dispatch({ type: ENABLE_TWO_FACTOR_ERROR, payload: errorData });
    return { success: false, error: errorData };
  }
};

// Disable two factor authentication
export const disableTwoFactorAction = () => async dispatch => {
  dispatch({ type: DISABLE_TWO_FACTOR_LOADING });
  try {
    const data = await disableTwoFactor();
    dispatch({ type: DISABLE_TWO_FACTOR, payload: data });
    return { success: true, data };
  } catch (errorData) {
    dispatch({ type: DISABLE_TWO_FACTOR_ERROR, payload: errorData });
    return { success: false, error: errorData };
  }
};

// Verify two factor code
export const verifyTwoFactorAction = token => async dispatch => {
  dispatch({ type: VERIFY_TWO_FACTOR_LOADING });
  try {
    const data = await verifyTwoFactorCode(token);
    dispatch({ type: VERIFY_TWO_FACTOR, payload: data });
    return { success: true, data };
  } catch (errorData) {
    dispatch({ type: VERIFY_TWO_FACTOR_ERROR, payload: errorData });
    return { success: false, error: errorData };
  }
};
