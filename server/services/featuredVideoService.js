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
    if (!videoData.videoType) {
      throw new AppError('Video type is required', 400);
    }
    if (!videoData.displayMode) {
      throw new AppError('Display mode is required', 400);
    }

    // Conditional validation based on videoType and displayMode
    // Title and description are required when displayMode is 'full' (Captions)
    if (videoData.displayMode === 'full') {
      if (!videoData.title) {
        throw new AppError(
          'Video title is required for captions display mode',
          400
        );
      }
      if (!videoData.description) {
        throw new AppError(
          'Video description is required for captions display mode',
          400
        );
      }
    }

    // YouTube link is required when:
    // 1. videoType is 'youtube' (YouTube Snippet) - always
    // 2. videoType is 'upload' AND displayMode is 'full' (Upload + Captions)
    const needsYouTubeLink =
      videoData.videoType === 'YOUTUBE' ||
      (videoData.videoType === 'UPLOAD' && videoData.displayMode === 'full');

    if (needsYouTubeLink && !videoData.youtubeLink) {
      throw new AppError('YouTube link is required', 400);
    }

    // Video file is required when videoType is 'upload'
    if (videoData.videoType === 'UPLOAD' && !videoData.videoFile) {
      throw new AppError('Video file is required for upload video type', 400);
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
