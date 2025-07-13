import {
  FETCH_PLAYERS,
  FETCH_PLAYERS_LOADING,
  FETCH_PLAYERS_ERROR,
} from '../actions/types';

const initialState = {
  data: [],
  loading: false,
  error: null,
};

export const musicReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PLAYERS_LOADING:
      return { ...state, loading: true, error: null };
    case FETCH_PLAYERS:
      return { ...state, data: action.payload, loading: false, error: null };
    case FETCH_PLAYERS_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
