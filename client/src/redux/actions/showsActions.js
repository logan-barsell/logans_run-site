import {
  FETCH_SHOWS,
  FETCH_SHOWS_LOADING,
  FETCH_SHOWS_ERROR,
  FETCH_SHOWS_SETTINGS,
  FETCH_SHOWS_SETTINGS_LOADING,
  FETCH_SHOWS_SETTINGS_ERROR,
  UPDATE_SHOWS_SETTINGS,
} from './types';
import {
  getShows,
  getShowsSettings,
  updateShowsSettings as updateShowsSettingsService,
} from '../../services/showsService';

// Fetch Shows
export const fetchShows = () => async dispatch => {
  dispatch({ type: FETCH_SHOWS_LOADING });
  try {
    const data = await getShows();
    dispatch({ type: FETCH_SHOWS, payload: data });
  } catch (errorData) {
    // errorData is already processed by handleServiceError in the service
    dispatch({ type: FETCH_SHOWS_ERROR, payload: errorData });
  }
};

// Fetch Shows Settings
export const fetchShowsSettings = () => async dispatch => {
  dispatch({ type: FETCH_SHOWS_SETTINGS_LOADING });
  try {
    const data = await getShowsSettings();
    dispatch({ type: FETCH_SHOWS_SETTINGS, payload: data });
  } catch (errorData) {
    // errorData is already processed by handleServiceError in the service
    dispatch({ type: FETCH_SHOWS_SETTINGS_ERROR, payload: errorData });
  }
};

// Update Shows Settings
export const updateShowsSettings = settings => async dispatch => {
  dispatch({ type: FETCH_SHOWS_SETTINGS_LOADING });
  try {
    const data = await updateShowsSettingsService(settings);
    dispatch({ type: UPDATE_SHOWS_SETTINGS, payload: data });
  } catch (errorData) {
    // errorData is already processed by handleServiceError in the service
    dispatch({ type: FETCH_SHOWS_SETTINGS_ERROR, payload: errorData });
  }
};
