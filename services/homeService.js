const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');
const { withTenant } = require('../db/withTenant');
const { toDate } = require('../utils/dates');
const { whitelistFields } = require('../utils/fieldWhitelist');

// Home image allowed fields
const HOME_IMAGE_FIELDS = ['imageUrl', 'altText', 'order'];

// Show allowed fields
const SHOW_FIELDS = [
  'poster',
  'venue',
  'location',
  'date',
  'doors',
  'showtime',
  'doorprice',
  'advprice',
  'tixlink',
];

async function getHomeImages(tenantId) {
  try {
    return await withTenant(tenantId, async tx => {
      return await tx.homeImage.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'asc' },
      });
    });
  } catch (error) {
    logger.error('❌ Error fetching home images:', error);
    throw new AppError(
      error.message || 'Error fetching home images',
      error.statusCode || 500
    );
  }
}

async function removeImage(tenantId, id) {
  try {
    if (!id) {
      throw new AppError('Image ID is required', 400);
    }

    return await withTenant(tenantId, async tx => {
      const existing = await tx.homeImage.findUnique({ where: { id } });
      if (!existing) throw new AppError('Image not found', 404);
      const deleted = await tx.homeImage.delete({ where: { id } });
      logger.info(`✅ Home image deleted successfully: ${id}`);
      return deleted;
    });
  } catch (error) {
    logger.error('❌ Error removing home image:', error);
    throw new AppError(
      error.message || 'Error removing home image',
      error.statusCode || 500
    );
  }
}

async function addHomeImage(tenantId, imageData) {
  try {
    if (!imageData) {
      throw new AppError('Image data is required', 400);
    }

    // Handle both single image and array of images
    const images = Array.isArray(imageData) ? imageData : [imageData];
    const processedImages = images.map(img => {
      const data = whitelistFields(img, HOME_IMAGE_FIELDS);
      return { ...data, tenantId };
    });

    return await withTenant(tenantId, async tx => {
      if (processedImages.length === 1) {
        const newImage = await tx.homeImage.create({
          data: processedImages[0],
        });
        logger.info('✅ Home image added successfully');
        return newImage;
      } else {
        const newImages = await tx.homeImage.createMany({
          data: processedImages,
        });
        logger.info(`✅ ${newImages.count} home images added successfully`);
        return newImages;
      }
    });
  } catch (error) {
    logger.error('❌ Error adding home image:', error);
    throw new AppError(
      error.message || 'Error adding home image',
      error.statusCode || 500
    );
  }
}

async function addShow(tenantId, showData) {
  try {
    if (!showData || Object.keys(showData).length === 0) {
      throw new AppError('Show data is required', 400);
    }

    const data = whitelistFields(showData, SHOW_FIELDS);
    if ('date' in data) data.date = toDate(data.date);

    return await withTenant(tenantId, async tx => {
      const newShow = await tx.show.create({
        data: { ...data, tenantId },
      });
      logger.info('✅ Show added successfully');
      return newShow;
    });
  } catch (error) {
    logger.error('❌ Error adding show:', error);
    throw new AppError(
      error.message || 'Error adding show',
      error.statusCode || 500
    );
  }
}

async function getShows(tenantId) {
  try {
    return await withTenant(tenantId, async tx => {
      return await tx.show.findMany({
        where: { tenantId },
        orderBy: { date: 'asc' },
      });
    });
  } catch (error) {
    logger.error('❌ Error fetching shows:', error);
    throw new AppError(
      error.message || 'Error fetching shows',
      error.statusCode || 500
    );
  }
}

async function updateShow(tenantId, id, showData) {
  try {
    if (!id) {
      throw new AppError('Show ID is required', 400);
    }
    if (!showData || Object.keys(showData).length === 0) {
      throw new AppError('Show update data is required', 400);
    }

    const data = whitelistFields(showData, SHOW_FIELDS);
    if ('date' in data) data.date = toDate(data.date);

    return await withTenant(tenantId, async tx => {
      const existing = await tx.show.findUnique({ where: { id } });
      if (!existing) throw new AppError('Show not found', 404);
      const updated = await tx.show.update({ where: { id }, data });
      logger.info(`✅ Show updated successfully: ${id}`);
      return updated;
    });
  } catch (error) {
    logger.error('❌ Error updating show:', error);
    throw new AppError(
      error.message || 'Error updating show',
      error.statusCode || 500
    );
  }
}

async function deleteShow(tenantId, id) {
  try {
    if (!id) {
      throw new AppError('Show ID is required', 400);
    }

    return await withTenant(tenantId, async tx => {
      const existing = await tx.show.findUnique({ where: { id } });
      if (!existing) throw new AppError('Show not found', 404);
      const deleted = await tx.show.delete({ where: { id } });
      logger.info(`✅ Show deleted successfully: ${id}`);
      return deleted;
    });
  } catch (error) {
    logger.error('❌ Error deleting show:', error);
    throw new AppError(
      error.message || 'Error deleting show',
      error.statusCode || 500
    );
  }
}

module.exports = {
  getHomeImages,
  removeImage,
  addHomeImage,
  addShow,
  getShows,
  updateShow,
  deleteShow,
};
