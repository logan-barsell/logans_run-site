import {
  FETCH_PLAYERS,
  FETCH_PLAYERS_LOADING,
  FETCH_PLAYERS_ERROR,
} from './types';
import { getPlayers } from '../../services/musicService';

// Fetch Music Players
export const fetchPlayers = () => async dispatch => {
  dispatch({ type: FETCH_PLAYERS_LOADING });
  try {
    const data = await getPlayers();
    dispatch({ type: FETCH_PLAYERS, payload: data });
  } catch (err) {
    dispatch({ type: FETCH_PLAYERS_ERROR, payload: err.message });
  }
};
