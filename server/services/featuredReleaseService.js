const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');
const { withTenant } = require('../db/withTenant');
const { whitelistFields } = require('../utils/fieldWhitelist');

// Featured release allowed fields
const FEATURED_RELEASE_FIELDS = [
  'coverImage',
  'title',
  'type',
  'releaseDate',
  'musicLink',
];

async function getFeaturedReleases(tenantId) {
  try {
    return await withTenant(tenantId, async tx => {
      return tx.featuredRelease.findMany({
        where: { tenantId },
        orderBy: { releaseDate: 'desc' },
      });
    });
  } catch (error) {
    logger.error('❌ Error fetching featured releases:', error);
    throw new AppError(
      error.message || 'Error fetching featured releases',
      error.statusCode || 500
    );
  }
}

async function addFeaturedRelease(tenantId, releaseData) {
  try {
    if (!releaseData || Object.keys(releaseData).length === 0) {
      throw new AppError('Release data is required', 400);
    }
    const data = whitelistFields(releaseData, FEATURED_RELEASE_FIELDS);

    return await withTenant(tenantId, async tx => {
      const newRelease = await tx.featuredRelease.create({
        data: { ...data, tenantId },
      });
      logger.info('✅ Featured release added successfully');
      return newRelease;
    });
  } catch (error) {
    logger.error('❌ Error adding featured release:', error);
    throw new AppError(
      error.message || 'Error adding featured release',
      error.statusCode || 500
    );
  }
}

async function updateFeaturedRelease(tenantId, id, releaseData) {
  try {
    if (!id) {
      throw new AppError('Release ID is required', 400);
    }
    if (!releaseData || Object.keys(releaseData).length === 0) {
      throw new AppError('Release update data is required', 400);
    }
    const data = whitelistFields(releaseData, FEATURED_RELEASE_FIELDS);

    return await withTenant(tenantId, async tx => {
      const existing = await tx.featuredRelease.findUnique({ where: { id } });
      if (!existing) throw new AppError('Featured release not found', 404);
      const updated = await tx.featuredRelease.update({ where: { id }, data });
      logger.info(`✅ Featured release updated successfully: ${id}`);
      return updated;
    });
  } catch (error) {
    logger.error('❌ Error updating featured release:', error);
    throw new AppError(
      error.message || 'Error updating featured release',
      error.statusCode || 500
    );
  }
}

async function deleteFeaturedRelease(tenantId, id) {
  try {
    if (!id) {
      throw new AppError('Release ID is required', 400);
    }

    return await withTenant(tenantId, async tx => {
      const existing = await tx.featuredRelease.findUnique({ where: { id } });
      if (!existing) throw new AppError('Featured release not found', 404);
      await tx.featuredRelease.delete({ where: { id } });
      logger.info(`✅ Featured release deleted successfully: ${id}`);
    });
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
