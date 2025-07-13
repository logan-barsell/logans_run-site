import {
  FETCH_VIDEOS,
  FETCH_VIDEOS_LOADING,
  FETCH_VIDEOS_ERROR,
} from '../actions/types';

const initialState = {
  data: [],
  loading: false,
  error: null,
};

export const videosReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_VIDEOS_LOADING:
      return { ...state, loading: true, error: null };
    case FETCH_VIDEOS:
      return { ...state, data: action.payload, loading: false, error: null };
    case FETCH_VIDEOS_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
