const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');
const { withTenant } = require('../db/withTenant');
const { validateSocialUrls } = require('../utils/urls');
const { whitelistFields } = require('../utils/fieldWhitelist');

// Contact info allowed fields
const CONTACT_FIELDS = [
  'publicEmail',
  'publicPhone',
  'facebook',
  'instagram',
  'youtube',
  'soundcloud',
  'spotify',
  'appleMusic',
  'x',
  'tiktok',
];

async function getContactInfo(tenantId) {
  try {
    return await withTenant(tenantId, async tx => {
      const existing = await tx.contactInfo.findUnique({ where: { tenantId } });
      return existing; // return null if none
    });
  } catch (error) {
    logger.error('❌ Error fetching contact info:', error);
    throw new AppError(
      error.message || 'Error fetching contact information',
      error.statusCode || 500
    );
  }
}

async function updateContact(tenantId, updatedInfo) {
  try {
    if (!updatedInfo)
      throw new AppError('Contact information is required', 400);
    validateSocialUrls(updatedInfo);

    const data = whitelistFields(updatedInfo, CONTACT_FIELDS);

    return await withTenant(tenantId, async tx => {
      const existing = await tx.contactInfo.findUnique({ where: { tenantId } });
      if (!existing) {
        throw new AppError('Contact info does not exist for tenant', 404);
      }

      const updated = await tx.contactInfo.update({
        where: { tenantId },
        data,
      });
      logger.info('✅ Contact info updated successfully');
      return updated;
    });
  } catch (error) {
    logger.error('❌ Error updating contact info:', error);
    throw new AppError(
      error.message || 'Error updating contact information',
      error.statusCode || 500
    );
  }
}

module.exports = {
  getContactInfo,
  updateContact,
};
