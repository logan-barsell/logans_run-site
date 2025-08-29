const MediaImage = require('../models/MediaImage');
const Video = require('../models/Video');
const logger = require('../utils/logger');

class MediaService {
  /**
   * Update a video
   */
  async updateVideo(videoData) {
    try {
      if (!videoData || !videoData._id) {
        throw new Error('Video data and ID are required');
      }

      const video = await Video.findOneAndUpdate(
        { _id: videoData._id },
        videoData,
        { new: true }
      );

      if (!video) {
        throw new Error('Video not found');
      }

      logger.info(`Video updated successfully: ${videoData._id}`);
      return video;
    } catch (error) {
      logger.error('Error updating video:', error);
      throw error;
    }
  }

  /**
   * Delete a video by ID
   */
  async deleteVideo(id) {
    try {
      if (!id) {
        throw new Error('Video ID is required');
      }

      const deletedVideo = await Video.findByIdAndDelete(id);

      if (!deletedVideo) {
        throw new Error('Video not found');
      }

      logger.info(`Video deleted successfully: ${id}`);
      return deletedVideo;
    } catch (error) {
      logger.error('Error deleting video:', error);
      throw error;
    }
  }

  /**
   * Get videos with optional category filter
   */
  async getVideos(category = null) {
    try {
      let videos;
      if (category) {
        videos = await Video.find({ category }).sort({ date: -1 });
      } else {
        videos = await Video.find().sort({ date: -1 });
      }
      return videos;
    } catch (error) {
      logger.error('Error fetching videos:', error);
      throw error;
    }
  }

  /**
   * Add a new video
   */
  async addVideo(videoData) {
    try {
      if (!videoData || Object.keys(videoData).length === 0) {
        throw new Error('Video data is required');
      }

      const video = new Video(videoData);
      await video.save();

      logger.info('New video added successfully');

      // Send newsletter notification for new video
      try {
        const NewsletterService = require('./newsletterService');
        await NewsletterService.sendContentNotification('video', {
          title: video.title || 'New Video',
          description: video.category
            ? `New ${video.category} video`
            : 'New video uploaded',
          duration: video.duration,
        });
      } catch (notificationError) {
        logger.error(
          'Failed to send newsletter notification for new video:',
          notificationError
        );
        // Don't throw error - video was still added successfully
      }

      return video;
    } catch (error) {
      logger.error('Error adding video:', error);
      throw error;
    }
  }

  /**
   * Get all media images
   */
  async getMediaImages() {
    try {
      const images = await MediaImage.find().sort({ name: -1 });
      return images;
    } catch (error) {
      logger.error('Error fetching media images:', error);
      throw error;
    }
  }

  /**
   * Remove a media image by ID
   */
  async removeMediaImage(id) {
    try {
      if (!id) {
        throw new Error('Image ID is required');
      }

      const deletedImage = await MediaImage.findOneAndDelete({ _id: id });

      if (!deletedImage) {
        throw new Error('Image not found');
      }

      logger.info(`Media image deleted successfully: ${id}`);
      return deletedImage;
    } catch (error) {
      logger.error('Error deleting media image:', error);
      throw error;
    }
  }

  /**
   * Add media image(s)
   */
  async addMediaImage(imageData) {
    try {
      if (!imageData) {
        throw new Error('Image data is required');
      }

      // Check if the request body is an array or single object
      if (Array.isArray(imageData)) {
        // Multiple images
        if (imageData.length === 0) {
          throw new Error('At least one image is required');
        }

        const mediaImages = imageData.map(
          imageData => new MediaImage(imageData)
        );
        const savedImages = await MediaImage.insertMany(mediaImages);

        logger.info(`${savedImages.length} media images added successfully`);
        return savedImages;
      } else {
        // Single image
        const image = new MediaImage(imageData);
        const savedImage = await image.save();

        logger.info('Media image added successfully');
        return savedImage;
      }
    } catch (error) {
      logger.error('Error adding media image:', error);
      throw error;
    }
  }
}

module.exports = new MediaService();
