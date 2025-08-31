const BioService = require('../services/bioService');
const { AppError } = require('../middleware/errorHandler');

/**
 * Get bio information
 */
async function getBio(req, res, next) {
  try {
    const bio = await BioService.getBio();
    res.status(200).json({
      success: true,
      data: bio,
    });
  } catch (error) {
    next(new AppError('Failed to fetch bio information', 500));
  }
}

/**
 * Update bio content
 */
async function updateBio(req, res, next) {
  try {
    const content = req.body.data;
    const result = await BioService.updateBio(content);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error.message === 'Bio content is required') {
      return next(new AppError('Bio content is required', 400));
    }
    next(new AppError('Failed to update bio', 500));
  }
}

/**
 * Add a new member
 */
async function addMember(req, res, next) {
  try {
    const result = await BioService.addMember(req.body);
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error.message === 'Member data is required') {
      return next(new AppError('Member data is required', 400));
    }
    next(new AppError('Failed to add member', 500));
  }
}

/**
 * Delete a member by ID
 */
async function deleteMember(req, res, next) {
  try {
    const result = await BioService.deleteMember(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Member deleted successfully',
    });
  } catch (error) {
    if (error.message === 'Member ID is required') {
      return next(new AppError('Member ID is required', 400));
    }
    if (error.message === 'Member not found') {
      return next(new AppError('Member not found', 404));
    }
    next(new AppError('Failed to delete member', 500));
  }
}

/**
 * Get all members
 */
async function getMembers(req, res, next) {
  try {
    const members = await BioService.getMembers();
    res.status(200).json({
      success: true,
      data: members,
    });
  } catch (error) {
    next(new AppError('Failed to fetch members', 500));
  }
}

/**
 * Update a member by ID
 */
async function updateMember(req, res, next) {
  try {
    const result = await BioService.updateMember(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error.message === 'Member ID is required') {
      return next(new AppError('Member ID is required', 400));
    }
    if (error.message === 'Member update data is required') {
      return next(new AppError('Member update data is required', 400));
    }
    if (error.message === 'Member not found') {
      return next(new AppError('Member not found', 404));
    }
    next(new AppError('Failed to update member', 500));
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
