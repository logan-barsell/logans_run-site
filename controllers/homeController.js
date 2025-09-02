const HomeService = require('../services/homeService');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * Get all home images
 */
async function getHomeImages(req, res, next) {
  try {
    const images = await HomeService.getHomeImages();
    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (error) {
    logger.error('❌ Failed to fetch home images:', error);
    next(error);
  }
}

/**
 * Remove a home image by ID
 */
async function removeImage(req, res, next) {
  try {
    const result = await HomeService.removeImage(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    logger.error('❌ Failed to delete home image:', error);
    next(error);
  }
}

/**
 * Add home image(s)
 */
async function addHomeImage(req, res, next) {
  try {
    const result = await HomeService.addHomeImage(req.body);
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('❌ Failed to add home image:', error);
    next(error);
  }
}

/**
 * Add a new show
 */
async function addShow(req, res, next) {
  try {
    const result = await HomeService.addShow(req.body);
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('❌ Failed to add show:', error);
    next(error);
  }
}

/**
 * Get all shows
 */
async function getShows(req, res, next) {
  try {
    const shows = await HomeService.getShows();
    res.status(200).json({
      success: true,
      data: shows,
    });
  } catch (error) {
    logger.error('❌ Failed to fetch shows:', error);
    next(error);
  }
}

/**
 * Update a show by ID
 */
async function updateShow(req, res, next) {
  try {
    const result = await HomeService.updateShow(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('❌ Failed to update show:', error);
    next(error);
  }
}

/**
 * Delete a show by ID
 */
async function deleteShow(req, res, next) {
  try {
    const result = await HomeService.deleteShow(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Show deleted successfully',
    });
  } catch (error) {
    logger.error('❌ Failed to delete show:', error);
    next(error);
  }
}

module.exports = {
  getHomeImages,
  removeImage,
  addHomeImage,
  addShow,
  getShows,
  updateShow,
  deleteShow,
};
