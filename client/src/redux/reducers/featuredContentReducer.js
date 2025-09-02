import {
  FETCH_FEATURED_RELEASES,
  FETCH_FEATURED_RELEASES_LOADING,
  FETCH_FEATURED_RELEASES_ERROR,
  FETCH_FEATURED_VIDEOS,
  FETCH_FEATURED_VIDEOS_LOADING,
  FETCH_FEATURED_VIDEOS_ERROR,
} from '../actions/types';

const featuredReleasesInitialState = {
  data: [],
  loading: false,
  error: null,
};

const featuredVideosInitialState = {
  data: [],
  loading: false,
  error: null,
};

export const featuredReleasesReducer = (
  state = featuredReleasesInitialState,
  action
) => {
  switch (action.type) {
    case FETCH_FEATURED_RELEASES_LOADING:
      return { ...state, loading: true, error: null };
    case FETCH_FEATURED_RELEASES:
      return { ...state, data: action.payload, loading: false, error: null };
    case FETCH_FEATURED_RELEASES_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const featuredVideosReducer = (
  state = featuredVideosInitialState,
  action
) => {
  switch (action.type) {
    case FETCH_FEATURED_VIDEOS_LOADING:
      return { ...state, loading: true, error: null };
    case FETCH_FEATURED_VIDEOS:
      return { ...state, data: action.payload, loading: false, error: null };
    case FETCH_FEATURED_VIDEOS_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
