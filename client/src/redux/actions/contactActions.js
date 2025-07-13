import {
  FETCH_CONTACT_INFO,
  FETCH_CONTACT_INFO_LOADING,
  FETCH_CONTACT_INFO_ERROR,
} from './types';
import { getContactInfo } from '../../services/contactService';

// Fetch Contact Info
export const fetchContactInfo = () => async dispatch => {
  dispatch({ type: FETCH_CONTACT_INFO_LOADING });
  try {
    const data = await getContactInfo();
    dispatch({ type: FETCH_CONTACT_INFO, payload: data });
  } catch (err) {
    dispatch({ type: FETCH_CONTACT_INFO_ERROR, payload: err.message });
  }
};
