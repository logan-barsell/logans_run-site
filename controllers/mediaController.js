const MediaService = require('../services/mediaService');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

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
    logger.error('❌ Failed to update video:', error);
    next(error);
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
    logger.error('❌ Failed to delete video:', error);
    next(error);
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
    logger.error('❌ Failed to fetch videos:', error);
    next(error);
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
    logger.error('❌ Failed to add video:', error);
    next(error);
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
    logger.error('❌ Failed to fetch media images:', error);
    next(error);
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
    logger.error('❌ Failed to delete media image:', error);
    next(error);
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
    logger.error('❌ Failed to add media image:', error);
    next(error);
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
