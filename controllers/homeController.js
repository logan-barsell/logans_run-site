const HomeService = require('../services/homeService');
const { AppError } = require('../middleware/errorHandler');

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
    next(new AppError('Failed to fetch home images', 500));
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
    if (error.message === 'Image data is required') {
      return next(new AppError('Image data is required', 400));
    }
    if (error.message === 'At least one image is required') {
      return next(new AppError('At least one image is required', 400));
    }
    next(new AppError('Failed to add home image', 500));
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
    if (error.message === 'Show data is required') {
      return next(new AppError('Show data is required', 400));
    }
    next(new AppError('Failed to add show', 500));
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
    next(new AppError('Failed to fetch shows', 500));
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
    if (error.message === 'Show ID is required') {
      return next(new AppError('Show ID is required', 400));
    }
    if (error.message === 'Show update data is required') {
      return next(new AppError('Show update data is required', 400));
    }
    if (error.message === 'Show not found') {
      return next(new AppError('Show not found', 404));
    }
    next(new AppError('Failed to update show', 500));
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
    if (error.message === 'Show ID is required') {
      return next(new AppError('Show ID is required', 400));
    }
    if (error.message === 'Show not found') {
      return next(new AppError('Show not found', 404));
    }
    next(new AppError('Failed to delete show', 500));
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
