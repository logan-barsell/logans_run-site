import { FETCH_THEME, UPDATE_THEME } from '../actions/types';

export const themeReducer = (state = {}, action) => {
  switch (action.type) {
    case FETCH_THEME:
      return { ...state, ...action.payload };
    case UPDATE_THEME:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
