import api from './api';
import { handleServiceError } from '../utils/errorHandler';

// Featured Releases
export const getFeaturedReleases = async () => {
  try {
    const response = await api.get('/featuredReleases');
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'getFeaturedReleases',
    });
    throw new Error(message);
  }
};

export const addFeaturedRelease = async releaseData => {
  try {
    const response = await api.post('/featuredReleases', releaseData);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'addFeaturedRelease',
    });
    throw new Error(message);
  }
};

export const updateFeaturedRelease = async (id, releaseData) => {
  try {
    const response = await api.put(`/featuredReleases/${id}`, releaseData);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'updateFeaturedRelease',
    });
    throw new Error(message);
  }
};

export const deleteFeaturedRelease = async id => {
  try {
    const response = await api.delete(`/featuredReleases/${id}`);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'deleteFeaturedRelease',
    });
    throw new Error(message);
  }
};

// Featured Videos
export const getFeaturedVideos = async () => {
  try {
    const response = await api.get('/featuredVideos');
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'getFeaturedVideos',
    });
    throw new Error(message);
  }
};

export const addFeaturedVideo = async videoData => {
  try {
    const response = await api.post('/featuredVideos', videoData);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'addFeaturedVideo',
    });
    throw new Error(message);
  }
};

export const updateFeaturedVideo = async (id, videoData) => {
  try {
    const response = await api.put(`/featuredVideos/${id}`, videoData);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'updateFeaturedVideo',
    });
    throw new Error(message);
  }
};

export const deleteFeaturedVideo = async id => {
  try {
    const response = await api.delete(`/featuredVideos/${id}`);
    return response.data.data; // Extract data from { success: true, data: [...] }
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'deleteFeaturedVideo',
    });
    throw new Error(message);
  }
};
