import apiClient from './api';
import { handleServiceError } from '../utils/errorHandler';

// Fetch the current merch config (public endpoint - only returns valid configs)
export async function getMerchConfig() {
  try {
    const res = await apiClient.get('/merchConfig');
    return res.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'getMerchConfig',
    });
    throw new Error(message);
  }
}

// Fetch the current merch config for admin (returns all configs)
export async function getMerchConfigAdmin() {
  try {
    const res = await apiClient.get('/merchConfig/admin');
    return res.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'getMerchConfigAdmin',
    });
    throw new Error(message);
  }
}

// Create or update the merch config
export async function updateMerchConfig(data) {
  try {
    const res = await apiClient.post('/merchConfig', data);
    return res.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'updateMerchConfig',
    });
    throw new Error(message);
  }
}

// Delete the merch config
export async function deleteMerchConfig() {
  try {
    const res = await apiClient.delete('/merchConfig');
    return res.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'deleteMerchConfig',
    });
    throw new Error(message);
  }
}
