import {
  FETCH_MEDIA_IMAGES,
  FETCH_VIDEOS,
  FETCH_MEDIA_IMAGES_LOADING,
  FETCH_MEDIA_IMAGES_ERROR,
  FETCH_VIDEOS_LOADING,
  FETCH_VIDEOS_ERROR,
} from './types';
import { getMediaImages, getVideos } from '../../services/mediaService';

// Fetch Media Images
export const fetchMediaImages = () => async dispatch => {
  dispatch({ type: FETCH_MEDIA_IMAGES_LOADING });
  try {
    const data = await getMediaImages();
    dispatch({ type: FETCH_MEDIA_IMAGES, payload: data });
  } catch (errorData) {
    // errorData is already processed by handleServiceError in the service
    dispatch({ type: FETCH_MEDIA_IMAGES_ERROR, payload: errorData });
  }
};

// Fetch Videos
export const fetchVideos = () => async dispatch => {
  dispatch({ type: FETCH_VIDEOS_LOADING });
  try {
    const data = await getVideos();
    dispatch({ type: FETCH_VIDEOS, payload: data });
  } catch (errorData) {
    // errorData is already processed by handleServiceError in the service
    dispatch({ type: FETCH_VIDEOS_ERROR, payload: errorData });
  }
};
