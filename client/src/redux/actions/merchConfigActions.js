import {
  FETCH_MERCH_CONFIG,
  UPDATE_MERCH_CONFIG,
  FETCH_MERCH_CONFIG_LOADING,
  FETCH_MERCH_CONFIG_ERROR,
} from './types';
import {
  getMerchConfig,
  getMerchConfigAdmin,
  updateMerchConfig as updateMerchConfigService,
} from '../../services/merchConfigService';

// Fetch Merch Config (admin endpoint - returns all configs)
export const fetchMerchConfig = () => async dispatch => {
  dispatch({ type: FETCH_MERCH_CONFIG_LOADING });
  try {
    const data = await getMerchConfigAdmin();
    dispatch({ type: FETCH_MERCH_CONFIG, payload: data });
  } catch (err) {
    dispatch({ type: FETCH_MERCH_CONFIG_ERROR, payload: err.message });
  }
};

// Fetch Merch Config (public endpoint - only returns valid configs)
export const fetchPublicMerchConfig = () => async dispatch => {
  dispatch({ type: FETCH_MERCH_CONFIG_LOADING });
  try {
    const data = await getMerchConfig();
    dispatch({ type: FETCH_MERCH_CONFIG, payload: data });
  } catch (err) {
    dispatch({ type: FETCH_MERCH_CONFIG_ERROR, payload: err.message });
  }
};

// Update Merch Config
export const updateMerchConfig = configData => async dispatch => {
  dispatch({ type: FETCH_MERCH_CONFIG_LOADING });
  try {
    const data = await updateMerchConfigService(configData);
    dispatch({ type: UPDATE_MERCH_CONFIG, payload: data });
  } catch (err) {
    dispatch({ type: FETCH_MERCH_CONFIG_ERROR, payload: err.message });
  }
};
