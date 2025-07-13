import {
  FETCH_HOME_IMAGES,
  FETCH_HOME_IMAGES_LOADING,
  FETCH_HOME_IMAGES_ERROR,
} from './types';
import { getHomeImages } from '../../services/homeService';

// Fetch Home Images (carousel)
export const fetchHomeImages = () => async dispatch => {
  dispatch({ type: FETCH_HOME_IMAGES_LOADING });
  try {
    const data = await getHomeImages();
    dispatch({ type: FETCH_HOME_IMAGES, payload: data });
  } catch (err) {
    dispatch({ type: FETCH_HOME_IMAGES_ERROR, payload: err.message });
  }
};
