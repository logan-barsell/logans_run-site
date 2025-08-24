const mediaService = require('../services/mediaService');
const { AppError } = require('../middleware/errorHandler');

class MediaController {
  /**
   * Update a video
   */
  async updateVideo(req, res, next) {
    try {
      const result = await mediaService.updateVideo(req.body);
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
  async deleteVideo(req, res, next) {
    try {
      const result = await mediaService.deleteVideo(req.params.id);
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
  async getVideos(req, res, next) {
    try {
      const qCategory = req.query.category;
      const videos = await mediaService.getVideos(qCategory);
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
  async addVideo(req, res, next) {
    try {
      const result = await mediaService.addVideo(req.body);
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
  async getMediaImages(req, res, next) {
    try {
      const images = await mediaService.getMediaImages();
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
  async removeMediaImage(req, res, next) {
    try {
      const result = await mediaService.removeMediaImage(req.params.id);
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
  async addMediaImage(req, res, next) {
    try {
      const result = await mediaService.addMediaImage(req.body);
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
}

module.exports = new MediaController();
