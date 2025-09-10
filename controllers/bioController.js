const BioService = require('../services/bioService');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * Get bio information
 */
async function getBio(req, res, next) {
  try {
    const bio = await BioService.getBio(req.tenantId);
    if (!bio) return next(new AppError('Bio not found', 404));
    res.status(200).json({ success: true, data: bio });
  } catch (error) {
    logger.error('❌ Failed to fetch bio information:', error);
    next(error);
  }
}

/**
 * Update bio content
 */
async function updateBio(req, res, next) {
  try {
    const content = req.body;
    const result = await BioService.updateBio(req.tenantId, content);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    logger.error('❌ Failed to update bio:', error);
    next(error);
  }
}

/**
 * Add a new member
 */
async function addMember(req, res, next) {
  try {
    const result = await BioService.addMember(req.tenantId, req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    logger.error('❌ Failed to add member:', error);
    next(error);
  }
}

/**
 * Delete a member by ID
 */
async function deleteMember(req, res, next) {
  try {
    await BioService.deleteMember(req.tenantId, req.params.id);
    res
      .status(200)
      .json({ success: true, message: 'Member deleted successfully' });
  } catch (error) {
    logger.error('❌ Failed to delete member:', error);
    next(error);
  }
}

/**
 * Get all members
 */
async function getMembers(req, res, next) {
  try {
    const members = await BioService.getMembers(req.tenantId);
    res.status(200).json({ success: true, data: members });
  } catch (error) {
    logger.error('❌ Failed to fetch members:', error);
    next(error);
  }
}

/**
 * Update a member by ID
 */
async function updateMember(req, res, next) {
  try {
    const result = await BioService.updateMember(
      req.tenantId,
      req.params.id,
      req.body
    );
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    logger.error('❌ Failed to update member:', error);
    next(error);
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
