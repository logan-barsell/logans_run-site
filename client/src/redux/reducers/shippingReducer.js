import { FETCH_SHIPPING } from '../actions/types';

export const shippingReducer = (state = [], action) => {
  switch (action.type) {
    case FETCH_SHIPPING:
      return action.payload;
    default:
      return state;
  }
}