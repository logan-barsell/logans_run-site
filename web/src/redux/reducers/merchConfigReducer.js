import {
  FETCH_MERCH_CONFIG,
  UPDATE_MERCH_CONFIG,
  FETCH_MERCH_CONFIG_LOADING,
  FETCH_MERCH_CONFIG_ERROR,
} from '../actions/types';

const initialState = {
  data: null,
  loading: false,
  error: null,
};

export const merchConfigReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_MERCH_CONFIG_LOADING:
      return { ...state, loading: true, error: null };
    case FETCH_MERCH_CONFIG:
    case UPDATE_MERCH_CONFIG:
      return { ...state, data: action.payload, loading: false, error: null };
    case FETCH_MERCH_CONFIG_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
