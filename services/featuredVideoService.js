const FeaturedVideo = require('../models/FeaturedVideo');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');

async function getFeaturedVideos() {
  try {
    const videos = await FeaturedVideo.find().sort({ releaseDate: -1 });
    return videos;
  } catch (error) {
    logger.error('❌ Error fetching featured videos:', error);
    throw new AppError(
      error.message || 'Error fetching featured videos',
      error.statusCode || 500
    );
  }
}

async function addFeaturedVideo(videoData) {
  try {
    if (!videoData || Object.keys(videoData).length === 0) {
      throw new AppError('Video data is required', 400);
    }

    if (!videoData.releaseDate) {
      throw new AppError('Release date is required', 400);
    }

    if (!videoData.youtubeLink) {
      throw new AppError('YouTube link is required', 400);
    }

    const video = new FeaturedVideo(videoData);
    await video.save();

    logger.info('✅ Featured video added successfully');
    return video;
  } catch (error) {
    logger.error('❌ Error adding featured video:', error);
    throw new AppError(
      error.message || 'Error adding featured video',
      error.statusCode || 500
    );
  }
}

async function updateFeaturedVideo(id, videoData) {
  try {
    if (!id) {
      throw new AppError('Video ID is required', 400);
    }

    if (!videoData || Object.keys(videoData).length === 0) {
      throw new AppError('Video update data is required', 400);
    }

    const updated = await FeaturedVideo.findByIdAndUpdate(id, videoData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      throw new AppError('Video not found', 404);
    }

    logger.info('✅ Featured video updated successfully');
    return updated;
  } catch (error) {
    logger.error('❌ Error updating featured video:', error);
    throw new AppError(
      error.message || 'Error updating featured video',
      error.statusCode || 500
    );
  }
}

async function deleteFeaturedVideo(id) {
  try {
    if (!id) {
      throw new AppError('Video ID is required', 400);
    }

    const deleted = await FeaturedVideo.findByIdAndDelete(id);

    if (!deleted) {
      throw new AppError('Video not found', 404);
    }

    logger.info('✅ Featured video deleted successfully');
    return deleted;
  } catch (error) {
    logger.error('❌ Error deleting featured video:', error);
    throw new AppError(
      error.message || 'Error deleting featured video',
      error.statusCode || 500
    );
  }
}

module.exports = {
  getFeaturedVideos,
  addFeaturedVideo,
  updateFeaturedVideo,
  deleteFeaturedVideo,
};
