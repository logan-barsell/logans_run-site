const featuredReleaseService = require('../services/featuredReleaseService');
const { AppError } = require('../middleware/errorHandler');

class FeaturedReleaseController {
  async getFeaturedReleases(req, res, next) {
    try {
      const releases = await featuredReleaseService.getFeaturedReleases();
      res.status(200).json({
        success: true,
        data: releases,
      });
    } catch (error) {
      next(new AppError(error.message, 500));
    }
  }

  async addFeaturedRelease(req, res, next) {
    try {
      const release = await featuredReleaseService.addFeaturedRelease(req.body);
      res.status(201).json({
        success: true,
        data: release,
      });
    } catch (error) {
      next(new AppError(error.message, 500));
    }
  }

  async updateFeaturedRelease(req, res, next) {
    try {
      const release = await featuredReleaseService.updateFeaturedRelease(
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

  async deleteFeaturedRelease(req, res, next) {
    try {
      await featuredReleaseService.deleteFeaturedRelease(req.params.id);
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
}

module.exports = new FeaturedReleaseController();
