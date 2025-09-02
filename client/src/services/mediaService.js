import api from './api';
import { handleServiceError } from '../utils/errorHandler';

// Fetch Media Images
export const getMediaImages = async () => {
  try {
    const response = await api.get('/getMediaImages');
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'getMediaImages',
    });
    throw new Error(message);
  }
};

// Media Images Management
export const uploadMediaImage = async imageData => {
  try {
    const response = await api.post('/addMediaImage', imageData);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'uploadMediaImage',
    });
    throw new Error(message);
  }
};

export const removeMediaImage = async imageId => {
  try {
    const response = await api.get(`/removeMediaImage/${imageId}`);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'removeMediaImage',
    });
    throw new Error(message);
  }
};

// Home Images (Carousel) Management
export const uploadHomeImage = async imageData => {
  try {
    const response = await api.post('/addHomeImage', imageData);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'uploadHomeImage',
    });
    throw new Error(message);
  }
};

export const removeHomeImage = async imageId => {
  try {
    const response = await api.get(`/removeImage/${imageId}`);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'removeHomeImage',
    });
    throw new Error(message);
  }
};

// Fetch Videos
export const getVideos = async () => {
  try {
    const response = await api.get('/getVideos');
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'getVideos',
    });
    throw new Error(message);
  }
};

// Videos Management
export const addVideo = async videoData => {
  try {
    const response = await api.post('/addVideo', videoData);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'addVideo',
    });
    throw new Error(message);
  }
};

export const updateVideo = async videoData => {
  try {
    const response = await api.post('/updateVideo', videoData);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'updateVideo',
    });
    throw new Error(message);
  }
};

export const deleteVideo = async videoId => {
  try {
    const response = await api.get(`/deleteVideo/${videoId}`);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'deleteVideo',
    });
    throw new Error(message);
  }
};
