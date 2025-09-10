const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');
const { withTenant } = require('../db/withTenant');
const { whitelistFields } = require('../utils/fieldWhitelist');

// Featured video allowed fields
const FEATURED_VIDEO_FIELDS = [
  'title',
  'description',
  'videoType',
  'displayMode',
  'youtubeLink',
  'videoFile',
  'videoThumbnail',
  'videoDuration',
  'videoFileSize',
  'startTime',
  'endTime',
  'releaseDate',
];

async function getFeaturedVideos(tenantId) {
  try {
    return await withTenant(tenantId, async tx => {
      return tx.featuredVideo.findMany({
        where: { tenantId },
        orderBy: { releaseDate: 'desc' },
      });
    });
  } catch (error) {
    logger.error('❌ Error fetching featured videos:', error);
    throw new AppError(
      error.message || 'Error fetching featured videos',
      error.statusCode || 500
    );
  }
}

async function addFeaturedVideo(tenantId, videoData) {
  try {
    if (!videoData || Object.keys(videoData).length === 0) {
      throw new AppError('Video data is required', 400);
    }

    // Validate required fields
    if (!videoData.title) {
      throw new AppError('Video title is required', 400);
    }
    if (!videoData.videoType) {
      throw new AppError('Video type is required', 400);
    }
    if (!videoData.displayMode) {
      throw new AppError('Display mode is required', 400);
    }
    if (!videoData.youtubeLink && videoData.videoType !== 'upload') {
      throw new AppError('YouTube link is required', 400);
    }

    const data = whitelistFields(videoData, FEATURED_VIDEO_FIELDS);

    return await withTenant(tenantId, async tx => {
      const newVideo = await tx.featuredVideo.create({
        data: { ...data, tenantId },
      });
      logger.info('✅ Featured video added successfully');
      return newVideo;
    });
  } catch (error) {
    logger.error('❌ Error adding featured video:', error);
    throw new AppError(
      error.message || 'Error adding featured video',
      error.statusCode || 500
    );
  }
}

async function updateFeaturedVideo(tenantId, id, videoData) {
  try {
    if (!id) {
      throw new AppError('Video ID is required', 400);
    }
    if (!videoData || Object.keys(videoData).length === 0) {
      throw new AppError('Video update data is required', 400);
    }

    const data = whitelistFields(videoData, FEATURED_VIDEO_FIELDS);

    return await withTenant(tenantId, async tx => {
      const existing = await tx.featuredVideo.findUnique({ where: { id } });
      if (!existing) throw new AppError('Video not found', 404);
      const updated = await tx.featuredVideo.update({ where: { id }, data });
      logger.info('✅ Featured video updated successfully');
      return updated;
    });
  } catch (error) {
    logger.error('❌ Error updating featured video:', error);
    throw new AppError(
      error.message || 'Error updating featured video',
      error.statusCode || 500
    );
  }
}

async function deleteFeaturedVideo(tenantId, id) {
  try {
    if (!id) {
      throw new AppError('Video ID is required', 400);
    }

    return await withTenant(tenantId, async tx => {
      const existing = await tx.featuredVideo.findUnique({ where: { id } });
      if (!existing) throw new AppError('Video not found', 404);
      await tx.featuredVideo.delete({ where: { id } });
      logger.info('✅ Featured video deleted successfully');
    });
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
