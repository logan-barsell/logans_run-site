import {
  FETCH_FEATURED_RELEASES,
  FETCH_FEATURED_RELEASES_LOADING,
  FETCH_FEATURED_RELEASES_ERROR,
  FETCH_FEATURED_VIDEOS,
  FETCH_FEATURED_VIDEOS_LOADING,
  FETCH_FEATURED_VIDEOS_ERROR,
} from './types';
import {
  getFeaturedReleases,
  getFeaturedVideos,
} from '../../services/featuredContentService';

// Fetch Featured Releases
export const fetchFeaturedReleases = () => async dispatch => {
  dispatch({ type: FETCH_FEATURED_RELEASES_LOADING });
  try {
    const data = await getFeaturedReleases();
    dispatch({ type: FETCH_FEATURED_RELEASES, payload: data });
  } catch (err) {
    dispatch({ type: FETCH_FEATURED_RELEASES_ERROR, payload: err.message });
  }
};

// Fetch Featured Videos
export const fetchFeaturedVideos = () => async dispatch => {
  dispatch({ type: FETCH_FEATURED_VIDEOS_LOADING });
  try {
    const data = await getFeaturedVideos();
    dispatch({ type: FETCH_FEATURED_VIDEOS, payload: data });
  } catch (err) {
    dispatch({ type: FETCH_FEATURED_VIDEOS_ERROR, payload: err.message });
  }
};
