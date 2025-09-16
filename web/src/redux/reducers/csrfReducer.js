import {
  FETCH_CSRF_TOKEN,
  FETCH_CSRF_TOKEN_LOADING,
  FETCH_CSRF_TOKEN_ERROR,
} from '../actions/types';

const initialState = {
  data: null,
  loading: false,
  error: null,
};

export const csrfReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CSRF_TOKEN_LOADING:
      return { ...state, loading: true, error: null };
    case FETCH_CSRF_TOKEN:
      return { ...state, data: action.payload, loading: false, error: null };
    case FETCH_CSRF_TOKEN_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
