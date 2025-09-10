import {
  FETCH_USERS,
  FETCH_USERS_LOADING,
  FETCH_USERS_ERROR,
  UPDATE_USER_PROFILE,
  UPDATE_USER_PROFILE_LOADING,
  UPDATE_USER_PROFILE_ERROR,
  DELETE_USER,
  DELETE_USER_LOADING,
  DELETE_USER_ERROR,
} from '../actions/types';

const initialState = {
  data: [],
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null,
  deleteLoading: false,
  deleteError: null,
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch users
    case FETCH_USERS_LOADING:
      return { ...state, loading: true, error: null };
    case FETCH_USERS:
      return { ...state, data: action.payload, loading: false, error: null };
    case FETCH_USERS_ERROR:
      return { ...state, loading: false, error: action.payload };

    // Update user profile
    case UPDATE_USER_PROFILE_LOADING:
      return { ...state, updateLoading: true, updateError: null };
    case UPDATE_USER_PROFILE:
      return {
        ...state,
        data: state.data.map(user =>
          user.id === action.payload.id ? action.payload : user
        ),
        updateLoading: false,
        updateError: null,
      };
    case UPDATE_USER_PROFILE_ERROR:
      return { ...state, updateLoading: false, updateError: action.payload };

    // Delete user
    case DELETE_USER_LOADING:
      return { ...state, deleteLoading: true, deleteError: null };
    case DELETE_USER:
      return {
        ...state,
        data: state.data.filter(user => user.id !== action.payload.id),
        deleteLoading: false,
        deleteError: null,
      };
    case DELETE_USER_ERROR:
      return { ...state, deleteLoading: false, deleteError: action.payload };

    default:
      return state;
  }
};
