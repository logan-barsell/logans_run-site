const FeaturedVideo = require('../models/FeaturedVideo');
const logger = require('../utils/logger');

class FeaturedVideoService {
  async getFeaturedVideos() {
    try {
      const videos = await FeaturedVideo.find().sort({ releaseDate: -1 });
      return videos;
    } catch (error) {
      logger.error('Error fetching featured videos:', error);
      throw new Error('Failed to fetch featured videos');
    }
  }

  async addFeaturedVideo(videoData) {
    try {
      if (!videoData.releaseDate) {
        throw new Error('releaseDate is required');
      }
      const video = new FeaturedVideo(videoData);
      await video.save();
      return video;
    } catch (error) {
      logger.error('Error adding featured video:', error);
      throw new Error('Failed to add featured video');
    }
  }

  async updateFeaturedVideo(id, videoData) {
    try {
      if (!videoData.releaseDate) {
        throw new Error('releaseDate is required');
      }
      const updated = await FeaturedVideo.findByIdAndUpdate(id, videoData, {
        new: true,
      });
      if (!updated) {
        throw new Error('Featured video not found');
      }
      return updated;
    } catch (error) {
      logger.error('Error updating featured video:', error);
      throw new Error('Failed to update featured video');
    }
  }

  async deleteFeaturedVideo(id) {
    try {
      const deleted = await FeaturedVideo.findByIdAndDelete(id);
      if (!deleted) {
        throw new Error('Featured video not found');
      }
      return deleted;
    } catch (error) {
      logger.error('Error deleting featured video:', error);
      throw new Error('Failed to delete featured video');
    }
  }
}

module.exports = new FeaturedVideoService();
