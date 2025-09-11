const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');
const { withTenant } = require('../db/withTenant');
const { toDate } = require('../utils/dates');
const { whitelistFields } = require('../utils/fieldWhitelist');
const NewsletterService = require('./newsletterService');
const {
  validateVideoCategory,
  getCategoryDescription,
} = require('../utils/validation');

// Video allowed fields
const VIDEO_FIELDS = ['category', 'title', 'date', 'link', 'embedLink'];

// Media image allowed fields
const MEDIA_IMAGE_FIELDS = ['name', 'imgLink'];

async function addVideo(tenantId, videoData) {
  try {
    if (!videoData || Object.keys(videoData).length === 0) {
      throw new AppError('Video data is required', 400);
    }

    // Validate category before processing
    if (videoData.category) {
      validateVideoCategory(videoData.category);
    }

    const data = whitelistFields(videoData, VIDEO_FIELDS);
    if ('date' in data) data.date = toDate(data.date);

    return await withTenant(tenantId, async tx => {
      const newVideo = await tx.video.create({
        data: { ...data, tenantId },
      });
      logger.info('✅ Video added successfully');

      // Send newsletter notification for new video
      try {
        // Validate required fields for notification
        if (!newVideo.category) {
          throw new AppError(
            'Video category is required for notifications',
            400
          );
        }
        if (!newVideo.title) {
          throw new AppError('Video title is required for notifications', 400);
        }

        await NewsletterService.sendContentNotification(tenantId, 'video', {
          title: newVideo.title,
          description: getCategoryDescription(newVideo.category),
        });
      } catch (notificationError) {
        logger.error(
          'Failed to send newsletter notification:',
          notificationError
        );
        // Don't fail the video creation if newsletter fails
      }

      return newVideo;
    });
  } catch (error) {
    logger.error('❌ Error adding video:', error);
    throw new AppError(
      error.message || 'Error adding video',
      error.statusCode || 500
    );
  }
}

async function getVideos(tenantId, category) {
  try {
    return await withTenant(tenantId, async tx => {
      const where = { tenantId };
      if (category) where.category = category;

      return await tx.video.findMany({
        where,
        orderBy: { date: 'desc' },
      });
    });
  } catch (error) {
    logger.error('❌ Error fetching videos:', error);
    throw new AppError(
      error.message || 'Error fetching videos',
      error.statusCode || 500
    );
  }
}

async function updateVideo(tenantId, id, videoData) {
  try {
    if (!id) {
      throw new AppError('Video ID is required', 400);
    }
    if (!videoData || Object.keys(videoData).length === 0) {
      throw new AppError('Video update data is required', 400);
    }

    const data = whitelistFields(videoData, VIDEO_FIELDS);
    if ('date' in data) data.date = toDate(data.date);

    return await withTenant(tenantId, async tx => {
      const existing = await tx.video.findUnique({ where: { id } });
      if (!existing) throw new AppError('Video not found', 404);
      const updated = await tx.video.update({ where: { id }, data });
      logger.info(`✅ Video updated successfully: ${id}`);
      return updated;
    });
  } catch (error) {
    logger.error('❌ Error updating video:', error);
    throw new AppError(
      error.message || 'Error updating video',
      error.statusCode || 500
    );
  }
}

async function deleteVideo(tenantId, id) {
  try {
    if (!id) {
      throw new AppError('Video ID is required', 400);
    }

    return await withTenant(tenantId, async tx => {
      const existing = await tx.video.findUnique({ where: { id } });
      if (!existing) throw new AppError('Video not found', 404);
      const deleted = await tx.video.delete({ where: { id } });
      logger.info(`✅ Video deleted successfully: ${id}`);
      return deleted;
    });
  } catch (error) {
    logger.error('❌ Error deleting video:', error);
    throw new AppError(
      error.message || 'Error deleting video',
      error.statusCode || 500
    );
  }
}

async function getMediaImages(tenantId) {
  try {
    return await withTenant(tenantId, async tx => {
      return await tx.mediaImage.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
      });
    });
  } catch (error) {
    logger.error('❌ Error fetching media images:', error);
    throw new AppError(
      error.message || 'Error fetching media images',
      error.statusCode || 500
    );
  }
}

async function addMediaImage(tenantId, imageData) {
  try {
    if (!imageData) {
      throw new AppError('Image data is required', 400);
    }

    // Handle both single image and array of images
    const images = Array.isArray(imageData) ? imageData : [imageData];
    const processedImages = images.map(img => {
      const data = whitelistFields(img, MEDIA_IMAGE_FIELDS);
      return { ...data, tenantId };
    });

    return await withTenant(tenantId, async tx => {
      if (processedImages.length === 1) {
        const newImage = await tx.mediaImage.create({
          data: processedImages[0],
        });
        logger.info('✅ Media image added successfully');
        return newImage;
      } else {
        const newImages = await tx.mediaImage.createMany({
          data: processedImages,
        });
        logger.info(`✅ ${newImages.count} media images added successfully`);
        return newImages;
      }
    });
  } catch (error) {
    logger.error('❌ Error adding media image:', error);
    throw new AppError(
      error.message || 'Error adding media image',
      error.statusCode || 500
    );
  }
}

async function removeMediaImage(tenantId, id) {
  try {
    if (!id) {
      throw new AppError('Image ID is required', 400);
    }

    return await withTenant(tenantId, async tx => {
      const existing = await tx.mediaImage.findUnique({ where: { id } });
      if (!existing) throw new AppError('Image not found', 404);
      const deleted = await tx.mediaImage.delete({ where: { id } });
      logger.info(`✅ Media image deleted successfully: ${id}`);
      return deleted;
    });
  } catch (error) {
    logger.error('❌ Error removing media image:', error);
    throw new AppError(
      error.message || 'Error removing media image',
      error.statusCode || 500
    );
  }
}

module.exports = {
  addVideo,
  getVideos,
  updateVideo,
  deleteVideo,
  getMediaImages,
  addMediaImage,
  removeMediaImage,
};
