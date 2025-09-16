import {
  FETCH_THEME,
  UPDATE_THEME,
  FETCH_THEME_LOADING,
  FETCH_THEME_ERROR,
} from '../actions/types';

const initialState = {
  data: null,
  loading: false,
  error: null,
};

export const themeReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_THEME_LOADING:
      return { ...state, loading: true, error: null };
    case FETCH_THEME:
    case UPDATE_THEME:
      return { ...state, data: action.payload, loading: false, error: null };
    case FETCH_THEME_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
