import {
  FETCH_SHOWS,
  FETCH_SHOWS_LOADING,
  FETCH_SHOWS_ERROR,
  FETCH_SHOWS_SETTINGS,
  UPDATE_SHOWS_SETTINGS,
  FETCH_SHOWS_SETTINGS_LOADING,
  FETCH_SHOWS_SETTINGS_ERROR,
} from '../actions/types';

const showsInitialState = {
  data: [],
  loading: false,
  error: null,
};

export const showsReducer = (state = showsInitialState, action) => {
  switch (action.type) {
    case FETCH_SHOWS_LOADING:
      return { ...state, loading: true, error: null };
    case FETCH_SHOWS:
      return { ...state, data: action.payload, loading: false, error: null };
    case FETCH_SHOWS_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const showsSettingsInitialState = {
  data: { showSystem: 'custom', bandsintownArtist: '' },
  loading: false,
  error: null,
};

export const showsSettingsReducer = (
  state = showsSettingsInitialState,
  action
) => {
  switch (action.type) {
    case FETCH_SHOWS_SETTINGS_LOADING:
      return { ...state, loading: true, error: null };
    case FETCH_SHOWS_SETTINGS:
    case UPDATE_SHOWS_SETTINGS:
      return {
        ...state,
        data: { ...state.data, ...action.payload },
        loading: false,
        error: null,
      };
    case FETCH_SHOWS_SETTINGS_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
