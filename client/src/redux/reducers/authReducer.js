import {
  AUTH_LOADING,
  AUTH_SUCCESS,
  AUTH_ERROR,
  LOGOUT,
  UPDATE_USER,
} from '../actions/types';

const initialState = {
  user: null,
  authenticated: false,
  loading: true,
  error: null,
};

export const authReducer = (state = initialState, action) => {
  console.log(
    '🔄 [authReducer] Action dispatched:',
    action.type,
    action.payload ? 'with payload' : 'no payload'
  );

  switch (action.type) {
    case AUTH_LOADING:
      console.log('⏳ [authReducer] AUTH_LOADING - Setting loading: true');
      return {
        ...state,
        loading: true,
        error: null,
      };

    case AUTH_SUCCESS:
      console.log(
        '✅ [authReducer] AUTH_SUCCESS - User authenticated:',
        action.payload
      );
      return {
        ...state,
        user: action.payload,
        authenticated: true,
        loading: false,
        error: null,
      };

    case AUTH_ERROR:
      console.log(
        '❌ [authReducer] AUTH_ERROR - Authentication failed:',
        action.payload
      );
      return {
        ...state,
        user: null,
        authenticated: false,
        loading: false,
        error: action.payload,
      };

    case LOGOUT:
      console.log('🚪 [authReducer] LOGOUT - User logged out');
      return {
        ...state,
        user: null,
        authenticated: false,
        loading: false,
        error: null,
      };

    case UPDATE_USER:
      console.log(
        '👤 [authReducer] UPDATE_USER - User data updated:',
        action.payload
      );
      return {
        ...state,
        user: action.payload,
        authenticated: true,
        error: null,
      };

    default:
      console.log('❓ [authReducer] Unknown action:', action.type);
      return state;
  }
};
