const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');
const { withTenant } = require('../db/withTenant');
const { whitelistFields } = require('../utils/fieldWhitelist');

// Bio allowed fields
const BIO_FIELDS = ['name', 'text', 'imageType', 'customImageUrl'];

// Member allowed fields
const MEMBER_FIELDS = [
  'name',
  'role',
  'bioPic',
  'facebook',
  'instagram',
  'tiktok',
  'youtube',
  'x',
];

/**
 * Get bio information (single row per tenant)
 */
async function getBio(tenantId) {
  try {
    return await withTenant(tenantId, async tx => {
      const bio = await tx.bio.findUnique({ where: { tenantId } });
      return bio; // may be null
    });
  } catch (error) {
    logger.error('❌ Error fetching bio:', error);
    throw new AppError(
      error.message || 'Error fetching bio information',
      error.statusCode || 500
    );
  }
}

/**
 * Update bio content and image settings (no implicit create)
 */
async function updateBio(tenantId, bioData) {
  try {
    if (!bioData) {
      throw new AppError('Bio data is required', 400);
    }

    const data = whitelistFields(bioData, BIO_FIELDS);

    return await withTenant(tenantId, async tx => {
      const existing = await tx.bio.findUnique({ where: { tenantId } });
      if (!existing) throw new AppError('Bio not found for tenant', 404);

      const updated = await tx.bio.update({ where: { tenantId }, data });
      logger.info('✅ Bio updated successfully');
      return updated;
    });
  } catch (error) {
    logger.error('❌ Error updating bio:', error);
    throw new AppError(
      error.message || 'Error updating bio information',
      error.statusCode || 500
    );
  }
}

/**
 * Add a new member (tenant scoped)
 */
async function addMember(tenantId, memberData) {
  try {
    if (!memberData || Object.keys(memberData).length === 0) {
      throw new AppError('Member data is required', 400);
    }

    const data = whitelistFields(memberData, MEMBER_FIELDS);

    return await withTenant(tenantId, async tx => {
      const newMember = await tx.member.create({
        data: { ...data, tenantId },
      });
      logger.info('✅ Member added successfully');
      return newMember;
    });
  } catch (error) {
    logger.error('❌ Error adding member:', error);
    throw new AppError(
      error.message || 'Error adding member',
      error.statusCode || 500
    );
  }
}

/**
 * Delete a member by ID (tenant scoped)
 */
async function deleteMember(tenantId, id) {
  try {
    if (!id) {
      throw new AppError('Member ID is required', 400);
    }

    return await withTenant(tenantId, async tx => {
      const existing = await tx.member.findUnique({ where: { id } });
      if (!existing) throw new AppError('Member not found', 404);
      const deleted = await tx.member.delete({ where: { id } });
      logger.info(`✅ Member deleted successfully: ${id}`);
      return deleted;
    });
  } catch (error) {
    logger.error('❌ Error deleting member:', error);
    throw new AppError(
      error.message || 'Error deleting member',
      error.statusCode || 500
    );
  }
}

/**
 * Get all members for a tenant
 */
async function getMembers(tenantId) {
  try {
    return await withTenant(tenantId, async tx => {
      return await tx.member.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'asc' },
      });
    });
  } catch (error) {
    logger.error('❌ Error fetching members:', error);
    throw new AppError(
      error.message || 'Error fetching members',
      error.statusCode || 500
    );
  }
}

/**
 * Update a member by ID (tenant scoped)
 */
async function updateMember(tenantId, id, updateData) {
  try {
    if (!id) {
      throw new AppError('Member ID is required', 400);
    }
    if (!updateData || Object.keys(updateData).length === 0) {
      throw new AppError('Member update data is required', 400);
    }

    const data = whitelistFields(updateData, MEMBER_FIELDS);

    return await withTenant(tenantId, async tx => {
      const existing = await tx.member.findUnique({ where: { id } });
      if (!existing) throw new AppError('Member not found', 404);
      const updated = await tx.member.update({ where: { id }, data });
      logger.info(`✅ Member updated successfully: ${id}`);
      return updated;
    });
  } catch (error) {
    logger.error('❌ Error updating member:', error);
    throw new AppError(
      error.message || 'Error updating member',
      error.statusCode || 500
    );
  }
}

module.exports = {
  getBio,
  updateBio,
  addMember,
  deleteMember,
  getMembers,
  updateMember,
};
