import {
  FETCH_BIO,
  FETCH_BIO_LOADING,
  FETCH_BIO_ERROR,
} from '../actions/types';

const initialState = {
  data: null,
  loading: false,
  error: null,
};

export const bioReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_BIO_LOADING:
      return { ...state, loading: true, error: null };
    case FETCH_BIO:
      return { ...state, data: action.payload, loading: false, error: null };
    case FETCH_BIO_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
