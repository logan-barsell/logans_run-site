const FeaturedRelease = require('../models/FeaturedRelease');
const logger = require('../utils/logger');

class FeaturedReleaseService {
  async getFeaturedReleases() {
    try {
      const releases = await FeaturedRelease.find().sort({ releaseDate: -1 });
      return releases;
    } catch (error) {
      logger.error('Error fetching featured releases:', error);
      throw new Error('Failed to fetch featured releases');
    }
  }

  async addFeaturedRelease(releaseData) {
    try {
      const release = new FeaturedRelease(releaseData);
      await release.save();
      return release;
    } catch (error) {
      logger.error('Error adding featured release:', error);
      throw new Error('Failed to add featured release');
    }
  }

  async updateFeaturedRelease(id, releaseData) {
    try {
      const updated = await FeaturedRelease.findByIdAndUpdate(id, releaseData, {
        new: true,
      });
      if (!updated) {
        throw new Error('Featured release not found');
      }
      return updated;
    } catch (error) {
      logger.error('Error updating featured release:', error);
      throw new Error('Failed to update featured release');
    }
  }

  async deleteFeaturedRelease(id) {
    try {
      const deleted = await FeaturedRelease.findByIdAndDelete(id);
      if (!deleted) {
        throw new Error('Featured release not found');
      }
      return deleted;
    } catch (error) {
      logger.error('Error deleting featured release:', error);
      throw new Error('Failed to delete featured release');
    }
  }
}

module.exports = new FeaturedReleaseService();
