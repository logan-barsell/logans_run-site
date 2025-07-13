import {
  FETCH_THEME,
  UPDATE_THEME,
  FETCH_THEME_LOADING,
  FETCH_THEME_ERROR,
} from './types';
import {
  getTheme,
  updateTheme as updateThemeService,
} from '../../services/themeService';

// Fetch Theme
export const fetchTheme = () => async dispatch => {
  dispatch({ type: FETCH_THEME_LOADING });
  try {
    const data = await getTheme();
    dispatch({ type: FETCH_THEME, payload: data });
  } catch (err) {
    dispatch({ type: FETCH_THEME_ERROR, payload: err.message });
  }
};

// Update Theme
export const updateTheme = updatedTheme => async dispatch => {
  dispatch({ type: FETCH_THEME_LOADING });
  try {
    const data = await updateThemeService(updatedTheme);
    dispatch({ type: UPDATE_THEME, payload: data });
  } catch (err) {
    dispatch({ type: FETCH_THEME_ERROR, payload: err.message });
  }
};
