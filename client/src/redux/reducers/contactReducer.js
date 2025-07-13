import {
  FETCH_CONTACT_INFO,
  FETCH_CONTACT_INFO_LOADING,
  FETCH_CONTACT_INFO_ERROR,
} from '../actions/types';

const initialState = {
  data: null,
  loading: false,
  error: null,
};

export const contactReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CONTACT_INFO_LOADING:
      return { ...state, loading: true, error: null };
    case FETCH_CONTACT_INFO:
      return { ...state, data: action.payload, loading: false, error: null };
    case FETCH_CONTACT_INFO_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
