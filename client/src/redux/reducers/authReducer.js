import {
  AUTH_LOADING,
  AUTH_SUCCESS,
  AUTH_ERROR,
  LOGOUT,
  UPDATE_USER,
  LOGIN_LOADING,
  COMPLETE_TWO_FACTOR,
  COMPLETE_TWO_FACTOR_LOADING,
  COMPLETE_TWO_FACTOR_ERROR,
  SEND_TWO_FACTOR_CODE,
  SEND_TWO_FACTOR_CODE_LOADING,
  SEND_TWO_FACTOR_CODE_ERROR,
} from '../actions/types';

const initialState = {
  user: null,
  authenticated: false,
  loading: true,
  loginLoading: false,
  error: null,
  twoFactor: {
    completing: false,
    sendingCode: false,
    error: null,
  },
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case LOGIN_LOADING:
      return {
        ...state,
        loginLoading: true,
        error: null,
      };

    case AUTH_SUCCESS:
      return {
        ...state,
        user: action.payload,
        authenticated: true,
        loading: false,
        loginLoading: false,
        error: null,
      };

    case AUTH_ERROR:
      return {
        ...state,
        user: null,
        authenticated: false,
        loading: false,
        loginLoading: false,
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

    // 2FA Cases
    case COMPLETE_TWO_FACTOR_LOADING:
      return {
        ...state,
        twoFactor: {
          ...state.twoFactor,
          completing: true,
          error: null,
        },
      };

    case COMPLETE_TWO_FACTOR:
      return {
        ...state,
        twoFactor: {
          ...state.twoFactor,
          completing: false,
          error: null,
        },
      };

    case COMPLETE_TWO_FACTOR_ERROR:
      return {
        ...state,
        twoFactor: {
          ...state.twoFactor,
          completing: false,
          error: action.payload,
        },
      };

    case SEND_TWO_FACTOR_CODE_LOADING:
      return {
        ...state,
        twoFactor: {
          ...state.twoFactor,
          sendingCode: true,
          error: null,
        },
      };

    case SEND_TWO_FACTOR_CODE:
      return {
        ...state,
        twoFactor: {
          ...state.twoFactor,
          sendingCode: false,
          error: null,
        },
      };

    case SEND_TWO_FACTOR_CODE_ERROR:
      return {
        ...state,
        twoFactor: {
          ...state.twoFactor,
          sendingCode: false,
          error: action.payload,
        },
      };

    default:
      return state;
  }
};
