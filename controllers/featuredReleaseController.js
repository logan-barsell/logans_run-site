const FeaturedReleaseService = require('../services/featuredReleaseService');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

async function getFeaturedReleases(req, res, next) {
  try {
    const releases = await FeaturedReleaseService.getFeaturedReleases();
    res.status(200).json({
      success: true,
      data: releases,
    });
  } catch (error) {
    logger.error('❌ Failed to fetch featured releases:', error);
    next(error);
  }
}

async function addFeaturedRelease(req, res, next) {
  try {
    const release = await FeaturedReleaseService.addFeaturedRelease(req.body);
    res.status(201).json({
      success: true,
      data: release,
    });
  } catch (error) {
    logger.error('❌ Failed to add featured release:', error);
    next(error);
  }
}

async function updateFeaturedRelease(req, res, next) {
  try {
    const release = await FeaturedReleaseService.updateFeaturedRelease(
      req.params.id,
      req.body
    );
    res.status(200).json({
      success: true,
      data: release,
    });
  } catch (error) {
    logger.error('❌ Failed to update featured release:', error);
    next(error);
  }
}

async function deleteFeaturedRelease(req, res, next) {
  try {
    await FeaturedReleaseService.deleteFeaturedRelease(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Featured release deleted successfully',
    });
  } catch (error) {
    logger.error('❌ Failed to delete featured release:', error);
    next(error);
  }
}

module.exports = {
  getFeaturedReleases,
  addFeaturedRelease,
  updateFeaturedRelease,
  deleteFeaturedRelease,
};
