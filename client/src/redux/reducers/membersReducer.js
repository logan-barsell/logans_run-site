import { FETCH_MEMBERS } from '../actions/types';

export const membersReducer = (state = [], action) => {
  switch (action.type) {
    case FETCH_MEMBERS:
      return action.payload;
    default:
      return state;
  }
}