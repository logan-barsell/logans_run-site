const FeaturedRelease = require('../models/FeaturedRelease');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');

async function getFeaturedReleases() {
  try {
    const releases = await FeaturedRelease.find().sort({ releaseDate: -1 });
    return releases;
  } catch (error) {
    logger.error('❌ Error fetching featured releases:', error);
    throw new AppError(
      error.message || 'Error fetching featured releases',
      error.statusCode || 500
    );
  }
}

async function addFeaturedRelease(releaseData) {
  try {
    if (!releaseData || Object.keys(releaseData).length === 0) {
      throw new AppError('Release data is required', 400);
    }

    const release = new FeaturedRelease(releaseData);
    await release.save();

    logger.info('✅ Featured release added successfully');
    return release;
  } catch (error) {
    logger.error('❌ Error adding featured release:', error);
    throw new AppError(
      error.message || 'Error adding featured release',
      error.statusCode || 500
    );
  }
}

async function updateFeaturedRelease(id, releaseData) {
  try {
    if (!id) {
      throw new AppError('Release ID is required', 400);
    }

    if (!releaseData || Object.keys(releaseData).length === 0) {
      throw new AppError('Release update data is required', 400);
    }

    const updated = await FeaturedRelease.findByIdAndUpdate(id, releaseData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      throw new AppError('Featured release not found', 404);
    }

    logger.info(`✅ Featured release updated successfully: ${id}`);
    return updated;
  } catch (error) {
    logger.error('❌ Error updating featured release:', error);
    throw new AppError(
      error.message || 'Error updating featured release',
      error.statusCode || 500
    );
  }
}

async function deleteFeaturedRelease(id) {
  try {
    if (!id) {
      throw new AppError('Release ID is required', 400);
    }

    const deleted = await FeaturedRelease.findByIdAndDelete(id);

    if (!deleted) {
      throw new AppError('Featured release not found', 404);
    }

    logger.info(`✅ Featured release deleted successfully: ${id}`);
    return deleted;
  } catch (error) {
    logger.error('❌ Error deleting featured release:', error);
    throw new AppError(
      error.message || 'Error deleting featured release',
      error.statusCode || 500
    );
  }
}

module.exports = {
  getFeaturedReleases,
  addFeaturedRelease,
  updateFeaturedRelease,
  deleteFeaturedRelease,
};
