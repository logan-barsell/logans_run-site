import {
  AUTH_LOADING,
  AUTH_SUCCESS,
  AUTH_ERROR,
  LOGOUT,
  UPDATE_USER,
} from '../actions/authActions';

const initialState = {
  user: null,
  authenticated: false,
  loading: true,
  error: null,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case AUTH_SUCCESS:
      return {
        ...state,
        user: action.payload,
        authenticated: true,
        loading: false,
        error: null,
      };

    case AUTH_ERROR:
      return {
        ...state,
        user: null,
        authenticated: false,
        loading: false,
        error: action.payload,
      };

    case LOGOUT:
      return {
        ...state,
        user: null,
        authenticated: false,
        loading: false,
        error: null,
      };

    case UPDATE_USER:
      return {
        ...state,
        user: action.payload,
        authenticated: true,
        error: null,
      };

    default:
      return state;
  }
};
