import { FETCH_SHOWS } from '../actions/types';

export const showsReducer = (state = [], action) => {
  switch (action.type) {
    case FETCH_SHOWS:
      return action.payload;
    default:
      return state;
  }
}