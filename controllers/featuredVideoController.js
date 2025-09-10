const FeaturedVideoService = require('../services/featuredVideoService');
const logger = require('../utils/logger');

async function getFeaturedVideos(req, res, next) {
  try {
    const videos = await FeaturedVideoService.getFeaturedVideos(req.tenantId);
    res.status(200).json({ success: true, data: videos });
  } catch (error) {
    logger.error('❌ Failed to fetch featured videos:', error);
    next(error);
  }
}

async function addFeaturedVideo(req, res, next) {
  try {
    const video = await FeaturedVideoService.addFeaturedVideo(
      req.tenantId,
      req.body
    );
    res.status(201).json({ success: true, data: video });
  } catch (error) {
    logger.error('❌ Failed to add featured video:', error);
    next(error);
  }
}

async function updateFeaturedVideo(req, res, next) {
  try {
    const video = await FeaturedVideoService.updateFeaturedVideo(
      req.tenantId,
      req.params.id,
      req.body
    );
    res.status(200).json({ success: true, data: video });
  } catch (error) {
    logger.error('❌ Failed to update featured video:', error);
    next(error);
  }
}

async function deleteFeaturedVideo(req, res, next) {
  try {
    await FeaturedVideoService.deleteFeaturedVideo(req.tenantId, req.params.id);
    res
      .status(200)
      .json({ success: true, message: 'Featured video deleted successfully' });
  } catch (error) {
    logger.error('❌ Failed to delete featured video:', error);
    next(error);
  }
}

module.exports = {
  getFeaturedVideos,
  addFeaturedVideo,
  updateFeaturedVideo,
  deleteFeaturedVideo,
};
