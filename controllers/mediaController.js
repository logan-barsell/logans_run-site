const MediaService = require('../services/mediaService');
const { AppError } = require('../middleware/errorHandler');

/**
 * Update a video
 */
async function updateVideo(req, res, next) {
  try {
    const result = await MediaService.updateVideo(req.body);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error.message === 'Video data and ID are required') {
      return next(new AppError('Video data and ID are required', 400));
    }
    if (error.message === 'Video not found') {
      return next(new AppError('Video not found', 404));
    }
    next(new AppError('Failed to update video', 500));
  }
}

/**
 * Delete a video by ID
 */
async function deleteVideo(req, res, next) {
  try {
    const result = await MediaService.deleteVideo(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Video deleted successfully',
    });
  } catch (error) {
    if (error.message === 'Video ID is required') {
      return next(new AppError('Video ID is required', 400));
    }
    if (error.message === 'Video not found') {
      return next(new AppError('Video not found', 404));
    }
    next(new AppError('Failed to delete video', 500));
  }
}

/**
 * Get videos with optional category filter
 */
async function getVideos(req, res, next) {
  try {
    const qCategory = req.query.category;
    const videos = await MediaService.getVideos(qCategory);
    res.status(200).json({
      success: true,
      data: videos,
    });
  } catch (error) {
    next(new AppError('Failed to fetch videos', 500));
  }
}

/**
 * Add a new video
 */
async function addVideo(req, res, next) {
  try {
    const result = await MediaService.addVideo(req.body);
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error.message === 'Video data is required') {
      return next(new AppError('Video data is required', 400));
    }
    next(new AppError('Failed to add video', 500));
  }
}

/**
 * Get all media images
 */
async function getMediaImages(req, res, next) {
  try {
    const images = await MediaService.getMediaImages();
    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (error) {
    next(new AppError('Failed to fetch media images', 500));
  }
}

/**
 * Remove a media image by ID
 */
async function removeMediaImage(req, res, next) {
  try {
    const result = await MediaService.removeMediaImage(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    if (error.message === 'Image ID is required') {
      return next(new AppError('Image ID is required', 400));
    }
    if (error.message === 'Image not found') {
      return next(new AppError('Image not found', 404));
    }
    next(new AppError('Failed to delete image', 500));
  }
}

/**
 * Add media image(s)
 */
async function addMediaImage(req, res, next) {
  try {
    const result = await MediaService.addMediaImage(req.body);
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error.message === 'Image data is required') {
      return next(new AppError('Image data is required', 400));
    }
    if (error.message === 'At least one image is required') {
      return next(new AppError('At least one image is required', 400));
    }
    next(new AppError('Failed to add media image', 500));
  }
}

module.exports = {
  updateVideo,
  deleteVideo,
  getVideos,
  addVideo,
  getMediaImages,
  removeMediaImage,
  addMediaImage,
};
