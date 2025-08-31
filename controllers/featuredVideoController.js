const FeaturedVideoService = require('../services/featuredVideoService');
const { AppError } = require('../middleware/errorHandler');

async function getFeaturedVideos(req, res, next) {
  try {
    const videos = await FeaturedVideoService.getFeaturedVideos();
    res.status(200).json({
      success: true,
      data: videos,
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
}

async function addFeaturedVideo(req, res, next) {
  try {
    const video = await FeaturedVideoService.addFeaturedVideo(req.body);
    res.status(201).json({
      success: true,
      data: video,
    });
  } catch (error) {
    if (error.message === 'releaseDate is required') {
      next(new AppError(error.message, 400));
    } else {
      next(new AppError(error.message, 500));
    }
  }
}

async function updateFeaturedVideo(req, res, next) {
  try {
    const video = await FeaturedVideoService.updateFeaturedVideo(
      req.params.id,
      req.body
    );
    res.status(200).json({
      success: true,
      data: video,
    });
  } catch (error) {
    if (error.message === 'releaseDate is required') {
      next(new AppError(error.message, 400));
    } else if (error.message === 'Featured video not found') {
      next(new AppError(error.message, 404));
    } else {
      next(new AppError(error.message, 500));
    }
  }
}

async function deleteFeaturedVideo(req, res, next) {
  try {
    await FeaturedVideoService.deleteFeaturedVideo(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Featured video deleted successfully',
    });
  } catch (error) {
    if (error.message === 'Featured video not found') {
      next(new AppError(error.message, 404));
    } else {
      next(new AppError(error.message, 500));
    }
  }
}

module.exports = {
  getFeaturedVideos,
  addFeaturedVideo,
  updateFeaturedVideo,
  deleteFeaturedVideo,
};
