import {
  FETCH_USERS,
  FETCH_USERS_LOADING,
  FETCH_USERS_ERROR,
  UPDATE_USER_PROFILE,
  UPDATE_USER_PROFILE_LOADING,
  UPDATE_USER_PROFILE_ERROR,
  DELETE_USER,
  DELETE_USER_LOADING,
  DELETE_USER_ERROR,
} from './types';
import {
  initializeDefaultUser,
  updateUser,
  changePassword,
} from '../../services/userService';

// Initialize default user (this is what the service actually does)
export const initializeUser = () => async dispatch => {
  dispatch({ type: FETCH_USERS_LOADING });
  try {
    const data = await initializeDefaultUser();
    dispatch({ type: FETCH_USERS, payload: data });
  } catch (errorData) {
    dispatch({ type: FETCH_USERS_ERROR, payload: errorData });
  }
};

// Update user profile (userId parameter ignored as service doesn't use it)
export const updateUserProfileAction = (userId, userData) => async dispatch => {
  dispatch({ type: UPDATE_USER_PROFILE_LOADING });
  try {
    const data = await updateUser(userData);
    dispatch({ type: UPDATE_USER_PROFILE, payload: data });
    return { success: true, data };
  } catch (errorData) {
    dispatch({ type: UPDATE_USER_PROFILE_ERROR, payload: errorData });
    return { success: false, error: errorData };
  }
};

// Change user password
export const changePasswordAction =
  (currentPassword, newPassword) => async dispatch => {
    dispatch({ type: UPDATE_USER_PROFILE_LOADING });
    try {
      const data = await changePassword(currentPassword, newPassword);
      dispatch({ type: UPDATE_USER_PROFILE, payload: data });
      return { success: true, data };
    } catch (errorData) {
      dispatch({ type: UPDATE_USER_PROFILE_ERROR, payload: errorData });
      return { success: false, error: errorData };
    }
  };
