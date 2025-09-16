import {
  FETCH_CSRF_TOKEN,
  FETCH_CSRF_TOKEN_LOADING,
  FETCH_CSRF_TOKEN_ERROR,
} from './types';
import { getToken } from '../../services/csrfService';

// Fetch CSRF token
export const fetchCsrfToken = () => async dispatch => {
  dispatch({ type: FETCH_CSRF_TOKEN_LOADING });
  try {
    const data = await getToken();
    dispatch({ type: FETCH_CSRF_TOKEN, payload: data });
  } catch (errorData) {
    dispatch({ type: FETCH_CSRF_TOKEN_ERROR, payload: errorData });
  }
};
