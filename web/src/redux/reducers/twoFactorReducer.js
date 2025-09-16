import {
  FETCH_TWO_FACTOR_SETTINGS,
  FETCH_TWO_FACTOR_SETTINGS_LOADING,
  FETCH_TWO_FACTOR_SETTINGS_ERROR,
  ENABLE_TWO_FACTOR,
  ENABLE_TWO_FACTOR_LOADING,
  ENABLE_TWO_FACTOR_ERROR,
  DISABLE_TWO_FACTOR,
  DISABLE_TWO_FACTOR_LOADING,
  DISABLE_TWO_FACTOR_ERROR,
  VERIFY_TWO_FACTOR,
  VERIFY_TWO_FACTOR_LOADING,
  VERIFY_TWO_FACTOR_ERROR,
} from '../actions/types';

const initialState = {
  data: null,
  loading: false,
  error: null,
  enableLoading: false,
  enableError: null,
  disableLoading: false,
  disableError: null,
  verifyLoading: false,
  verifyError: null,
};

export const twoFactorReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch two factor settings
    case FETCH_TWO_FACTOR_SETTINGS_LOADING:
      return { ...state, loading: true, error: null };
    case FETCH_TWO_FACTOR_SETTINGS:
      return { ...state, data: action.payload, loading: false, error: null };
    case FETCH_TWO_FACTOR_SETTINGS_ERROR:
      return { ...state, loading: false, error: action.payload };

    // Enable two factor
    case ENABLE_TWO_FACTOR_LOADING:
      return { ...state, enableLoading: true, enableError: null };
    case ENABLE_TWO_FACTOR:
      return {
        ...state,
        data: { ...state.data, enabled: true },
        enableLoading: false,
        enableError: null,
      };
    case ENABLE_TWO_FACTOR_ERROR:
      return { ...state, enableLoading: false, enableError: action.payload };

    // Disable two factor
    case DISABLE_TWO_FACTOR_LOADING:
      return { ...state, disableLoading: true, disableError: null };
    case DISABLE_TWO_FACTOR:
      return {
        ...state,
        data: { ...state.data, enabled: false },
        disableLoading: false,
        disableError: null,
      };
    case DISABLE_TWO_FACTOR_ERROR:
      return { ...state, disableLoading: false, disableError: action.payload };

    // Verify two factor
    case VERIFY_TWO_FACTOR_LOADING:
      return { ...state, verifyLoading: true, verifyError: null };
    case VERIFY_TWO_FACTOR:
      return {
        ...state,
        verifyLoading: false,
        verifyError: null,
      };
    case VERIFY_TWO_FACTOR_ERROR:
      return { ...state, verifyLoading: false, verifyError: action.payload };

    default:
      return state;
  }
};
