import axios from 'axios';
import { FETCH_BIO, FETCH_MEMBERS, FETCH_PRODUCTS, FETCH_SHOWS, FETCH_SHIPPING, FETCH_CONTACT_INFO, FETCH_HOME_IMAGES, FETCH_MEDIA_IMAGES, FETCH_VIDEOS, FETCH_PLAYERS } from './types';

export const fetchContactInfo = () => async dispatch => {
  const res = await axios.get('/api/getContactInfo');
  dispatch({ type: FETCH_CONTACT_INFO, payload: res.data });
}

export const fetchBio = () => async dispatch => {
  const res = await axios.get('/api/bio');
  dispatch({ type: FETCH_BIO, payload: res.data });
}

export const fetchMembers = () => async dispatch => {
  const res = await axios.get('/api/members');
  dispatch({ type: FETCH_MEMBERS, payload: res.data });
}

export const fetchShows = () => async dispatch => {
  const res = await axios.get('/api/shows');
  dispatch({ type: FETCH_SHOWS, payload: res.data });
}

export const fetchProducts = () => async dispatch => {
  const res = await axios.get('/api/products');
  dispatch({ type: FETCH_PRODUCTS, payload: res.data });
}

export const fetchShipping = () => async dispatch => {
  const res = await axios.get('/api/shipping');
  dispatch({ type: FETCH_SHIPPING, payload: res.data });
}

export const fetchHomeImages = () => async dispatch => {
  const res = await axios.get('/api/getHomeImages');
  dispatch({ type: FETCH_HOME_IMAGES, payload: res.data });
}

export const fetchMediaImages = () => async dispatch => {
  const res = await axios.get('/api/getMediaImages');
  dispatch({ type: FETCH_MEDIA_IMAGES, payload: res.data });
}

export const fetchVideos = () => async dispatch => {
  const res = await axios.get('/api/getVideos');
  dispatch({ type: FETCH_VIDEOS, payload: res.data});
}

export const fetchPlayers = () => async dispatch => {
  const res = await axios.get('/api/getPlayers');
  dispatch({ type: FETCH_PLAYERS, payload: res.data });
}