import api from './api';
import { handleServiceError } from '../utils/errorHandler';

// Media Images
export const uploadMediaImage = async imageData => {
  try {
    const response = await api.post('/addMediaImage', imageData);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(
      error,
      'Failed to upload media image'
    );
    throw new Error(message);
  }
};

export const removeMediaImage = async imageId => {
  try {
    const response = await api.get(`/removeMediaImage/${imageId}`);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(
      error,
      'Failed to remove media image'
    );
    throw new Error(message);
  }
};

// Home Images (Carousel)
export const uploadHomeImage = async imageData => {
  try {
    const response = await api.post('/addHomeImage', imageData);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(
      error,
      'Failed to upload home image'
    );
    throw new Error(message);
  }
};

export const removeHomeImage = async imageId => {
  try {
    const response = await api.get(`/removeImage/${imageId}`);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(
      error,
      'Failed to remove home image'
    );
    throw new Error(message);
  }
};

// Videos
export const addVideo = async videoData => {
  try {
    const response = await api.post('/addVideo', videoData);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, 'Failed to add video');
    throw new Error(message);
  }
};

export const updateVideo = async videoData => {
  try {
    const response = await api.post('/updateVideo', videoData);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, 'Failed to update video');
    throw new Error(message);
  }
};

export const deleteVideo = async videoId => {
  try {
    const response = await api.get(`/deleteVideo/${videoId}`);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, 'Failed to delete video');
    throw new Error(message);
  }
};
