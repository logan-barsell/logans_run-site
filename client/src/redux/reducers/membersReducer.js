import {
  FETCH_MEMBERS,
  FETCH_MEMBERS_LOADING,
  FETCH_MEMBERS_ERROR,
} from '../actions/types';

const initialState = {
  data: [],
  loading: false,
  error: null,
};

export const membersReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_MEMBERS_LOADING:
      return { ...state, loading: true, error: null };
    case FETCH_MEMBERS:
      return { ...state, data: action.payload, loading: false, error: null };
    case FETCH_MEMBERS_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
