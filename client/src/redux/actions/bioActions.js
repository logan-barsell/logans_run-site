import {
  FETCH_BIO,
  FETCH_MEMBERS,
  FETCH_BIO_LOADING,
  FETCH_BIO_ERROR,
  FETCH_MEMBERS_LOADING,
  FETCH_MEMBERS_ERROR,
} from './types';
import { getBio, getMembers } from '../../services/bioService';

// Fetch Bio
export const fetchBio = () => async dispatch => {
  dispatch({ type: FETCH_BIO_LOADING });
  try {
    const data = await getBio();
    dispatch({ type: FETCH_BIO, payload: data });
  } catch (err) {
    dispatch({ type: FETCH_BIO_ERROR, payload: err.message });
  }
};

// Fetch Members
export const fetchMembers = () => async dispatch => {
  dispatch({ type: FETCH_MEMBERS_LOADING });
  try {
    const data = await getMembers();
    dispatch({ type: FETCH_MEMBERS, payload: data });
  } catch (err) {
    dispatch({ type: FETCH_MEMBERS_ERROR, payload: err.message });
  }
};
