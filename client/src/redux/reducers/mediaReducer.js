import {
  FETCH_MEDIA_IMAGES,
  FETCH_MEDIA_IMAGES_LOADING,
  FETCH_MEDIA_IMAGES_ERROR,
} from '../actions/types';

const initialState = {
  data: [],
  loading: false,
  error: null,
};

export const mediaReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_MEDIA_IMAGES_LOADING:
      return { ...state, loading: true, error: null };
    case FETCH_MEDIA_IMAGES:
      return { ...state, data: action.payload, loading: false, error: null };
    case FETCH_MEDIA_IMAGES_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
