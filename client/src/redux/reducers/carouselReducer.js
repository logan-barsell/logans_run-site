import {
  FETCH_HOME_IMAGES,
  FETCH_HOME_IMAGES_LOADING,
  FETCH_HOME_IMAGES_ERROR,
} from '../actions/types';

const initialState = {
  data: [],
  loading: false,
  error: null,
};

export const carouselReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_HOME_IMAGES_LOADING:
      return { ...state, loading: true, error: null };
    case FETCH_HOME_IMAGES:
      return { ...state, data: action.payload, loading: false, error: null };
    case FETCH_HOME_IMAGES_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
