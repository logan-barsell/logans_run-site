const memberModel = require('../models/Member');
const Bio = require('../models/BioText');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');

/**
 * Get bio information
 */
async function getBio() {
  try {
    const bio = await Bio.find();
    return bio;
  } catch (error) {
    logger.error('❌ Error fetching bio:', error);
    throw new AppError(
      error.message || 'Error fetching bio information',
      error.statusCode || 500
    );
  }
}

/**
 * Update bio content and image settings
 */
async function updateBio(bioData) {
  try {
    if (!bioData) {
      throw new AppError('Bio data is required', 400);
    }

    const updateData = {
      text: bioData.text || bioData.data,
    };

    // Add image type and custom image URL if provided
    if (bioData.imageType) {
      updateData.imageType = bioData.imageType;
    }

    if (bioData.customImageUrl) {
      updateData.customImageUrl = bioData.customImageUrl;
    }

    await Bio.updateOne({ name: 'bio' }, updateData, { upsert: true });
    logger.info('✅ Bio updated successfully');
    return updateData;
  } catch (error) {
    logger.error('❌ Error updating bio:', error);
    throw new AppError(
      error.message || 'Error updating bio information',
      error.statusCode || 500
    );
  }
}

/**
 * Add a new member
 */
async function addMember(memberData) {
  try {
    if (!memberData || Object.keys(memberData).length === 0) {
      throw new AppError('Member data is required', 400);
    }

    const newMember = {};
    for (let key in memberData) {
      newMember[key] = memberData[key];
    }

    const member = new memberModel(newMember);
    await member.save();

    logger.info('✅ New member added successfully');
    return member;
  } catch (error) {
    logger.error('❌ Error adding member:', error);
    throw new AppError(
      error.message || 'Error adding member',
      error.statusCode || 500
    );
  }
}

/**
 * Delete a member by ID
 */
async function deleteMember(id) {
  try {
    if (!id) {
      throw new AppError('Member ID is required', 400);
    }

    const deletedMember = await memberModel.findOneAndDelete({ _id: id });

    if (!deletedMember) {
      throw new AppError('Member not found', 404);
    }

    logger.info(`✅ Member deleted successfully: ${id}`);
    return deletedMember;
  } catch (error) {
    logger.error('❌ Error deleting member:', error);
    throw new AppError(
      error.message || 'Error deleting member',
      error.statusCode || 500
    );
  }
}

/**
 * Get all members
 */
async function getMembers() {
  try {
    const members = await memberModel.find().sort({ order: 1 });
    return members;
  } catch (error) {
    logger.error('❌ Error fetching members:', error);
    throw new AppError(
      error.message || 'Error fetching members',
      error.statusCode || 500
    );
  }
}

/**
 * Update a member by ID
 */
async function updateMember(id, updateData) {
  try {
    if (!id) {
      throw new AppError('Member ID is required', 400);
    }

    if (!updateData || Object.keys(updateData).length === 0) {
      throw new AppError('Member update data is required', 400);
    }

    const updatedMember = await memberModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedMember) {
      throw new AppError('Member not found', 404);
    }

    logger.info(`✅ Member updated successfully: ${id}`);
    return updatedMember;
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
