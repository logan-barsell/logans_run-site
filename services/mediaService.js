const MediaImage = require('../models/MediaImage');
const Video = require('../models/Video');
const NewsletterService = require('./newsletterService');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');

/**
 * Update a video
 */
async function updateVideo(videoData) {
  try {
    if (!videoData || !videoData._id) {
      throw new AppError('Video data and ID are required', 400);
    }

    const video = await Video.findOneAndUpdate(
      { _id: videoData._id },
      videoData,
      { new: true, runValidators: true }
    );

    if (!video) {
      throw new AppError('Video not found', 404);
    }

    logger.info(`✅ Video updated successfully: ${videoData._id}`);
    return video;
  } catch (error) {
    logger.error('❌ Error updating video:', error);
    throw new AppError(
      error.message || 'Error updating video',
      error.statusCode || 500
    );
  }
}

/**
 * Delete a video by ID
 */
async function deleteVideo(id) {
  try {
    if (!id) {
      throw new AppError('Video ID is required', 400);
    }

    const deletedVideo = await Video.findByIdAndDelete(id);

    if (!deletedVideo) {
      throw new AppError('Video not found', 404);
    }

    logger.info(`✅ Video deleted successfully: ${id}`);
    return deletedVideo;
  } catch (error) {
    logger.error('❌ Error deleting video:', error);
    throw new AppError(
      error.message || 'Error deleting video',
      error.statusCode || 500
    );
  }
}

/**
 * Get videos with optional category filter
 */
async function getVideos(category = null) {
  try {
    let videos;
    if (category) {
      videos = await Video.find({ category }).sort({ date: -1 });
    } else {
      videos = await Video.find().sort({ date: -1 });
    }
    return videos;
  } catch (error) {
    logger.error('❌ Error fetching videos:', error);
    throw new AppError(
      error.message || 'Error fetching videos',
      error.statusCode || 500
    );
  }
}

/**
 * Add a new video
 */
async function addVideo(videoData) {
  try {
    if (!videoData || Object.keys(videoData).length === 0) {
      throw new AppError('Video data is required', 400);
    }

    const video = new Video(videoData);
    await video.save();

    logger.info('✅ New video added successfully');

    // Send newsletter notification for new video
    try {
      await NewsletterService.sendContentNotification('video', {
        title: video.title || 'New Video',
        description: video.category
          ? `New ${video.category} video`
          : 'New video uploaded',
        duration: video.duration,
      });
    } catch (notificationError) {
      logger.error(
        'Failed to send newsletter notification:',
        notificationError
      );
      // Don't fail the video creation if newsletter fails
    }

    return video;
  } catch (error) {
    logger.error('❌ Error adding video:', error);
    throw new AppError(
      error.message || 'Error adding video',
      error.statusCode || 500
    );
  }
}

/**
 * Get all media images
 */
async function getMediaImages() {
  try {
    const images = await MediaImage.find();
    return images;
  } catch (error) {
    logger.error('❌ Error fetching media images:', error);
    throw new AppError(
      error.message || 'Error fetching media images',
      error.statusCode || 500
    );
  }
}

/**
 * Remove a media image by ID
 */
async function removeMediaImage(id) {
  try {
    if (!id) {
      throw new AppError('Image ID is required', 400);
    }

    const deletedImage = await MediaImage.findOneAndDelete({ _id: id });

    if (!deletedImage) {
      throw new AppError('Image not found', 404);
    }

    logger.info(`✅ Media image deleted successfully: ${id}`);
    return deletedImage;
  } catch (error) {
    logger.error('❌ Error deleting media image:', error);
    throw new AppError(
      error.message || 'Error deleting media image',
      error.statusCode || 500
    );
  }
}

/**
 * Add media image(s)
 */
async function addMediaImage(imageData) {
  try {
    if (!imageData) {
      throw new AppError('Image data is required', 400);
    }

    // Check if the request body is an array or single object
    if (Array.isArray(imageData)) {
      // Multiple images
      if (imageData.length === 0) {
        throw new AppError('At least one image is required', 400);
      }

      const mediaImages = imageData.map(imageData => new MediaImage(imageData));
      const savedImages = await MediaImage.insertMany(mediaImages);

      logger.info(`✅ ${savedImages.length} media images added successfully`);
      return savedImages;
    } else {
      // Single image
      const image = new MediaImage(imageData);
      const savedImage = await image.save();

      logger.info('✅ Media image added successfully');
      return savedImage;
    }
  } catch (error) {
    logger.error('❌ Error adding media image:', error);
    throw new AppError(
      error.message || 'Error adding media image',
      error.statusCode || 500
    );
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
