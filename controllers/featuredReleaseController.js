const FeaturedReleaseService = require('../services/featuredReleaseService');
const { AppError } = require('../middleware/errorHandler');

async function getFeaturedReleases(req, res, next) {
  try {
    const releases = await FeaturedReleaseService.getFeaturedReleases();
    res.status(200).json({
      success: true,
      data: releases,
    });
  } catch (error) {
    next(new AppError(error.message, 500));
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
    next(new AppError(error.message, 500));
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
    if (error.message === 'Featured release not found') {
      next(new AppError(error.message, 404));
    } else {
      next(new AppError(error.message, 500));
    }
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
    if (error.message === 'Featured release not found') {
      next(new AppError(error.message, 404));
    } else {
      next(new AppError(error.message, 500));
    }
  }
}

module.exports = {
  getFeaturedReleases,
  addFeaturedRelease,
  updateFeaturedRelease,
  deleteFeaturedRelease,
};
