import api from './api';
import { handleServiceError } from '../utils/errorHandler';

// Fetch the current merch config (public endpoint - only returns valid configs)
export async function getMerchConfig() {
  try {
    const res = await api.get('/merchConfig');
    return res.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const errorData = handleServiceError(error, {
      operation: 'getMerchConfig',
      customMessage:
        'Unable to load store configuration. Please try again later.',
    });
    throw errorData;
  }
}

// Fetch the current merch config for admin (returns all configs)
export async function getMerchConfigAdmin() {
  try {
    const res = await api.get('/merchConfig/admin');
    return res.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const errorData = handleServiceError(error, {
      operation: 'getMerchConfigAdmin',
      customMessage:
        'Unable to load store configuration. Please try again later.',
    });
    throw errorData;
  }
}

// Create or update the merch config
export async function updateMerchConfig(data) {
  try {
    const res = await api.post('/merchConfig', data);
    return res.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const errorData = handleServiceError(error, {
      operation: 'updateMerchConfig',
      customMessage: 'Failed to update store configuration. Please try again.',
    });
    throw errorData;
  }
}

// Delete the merch config
export async function deleteMerchConfig() {
  try {
    const res = await api.delete('/merchConfig');
    return res.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const errorData = handleServiceError(error, {
      operation: 'deleteMerchConfig',
      customMessage: 'Failed to delete store configuration. Please try again.',
    });
    throw errorData;
  }
}
