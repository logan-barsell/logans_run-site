const memberModel = require('../models/Member');
const Bio = require('../models/BioText');
const logger = require('../utils/logger');

class BioService {
  /**
   * Get bio information
   */
  async getBio() {
    try {
      const bio = await Bio.find();
      return bio;
    } catch (error) {
      logger.error('Error fetching bio:', error);
      throw error;
    }
  }

  /**
   * Update bio content
   */
  async updateBio(content) {
    try {
      if (!content) {
        throw new Error('Bio content is required');
      }

      await Bio.updateOne({ name: 'bio' }, { text: content }, { upsert: true });
      logger.info('Bio updated successfully');
      return content;
    } catch (error) {
      logger.error('Error updating bio:', error);
      throw error;
    }
  }

  /**
   * Add a new member
   */
  async addMember(memberData) {
    try {
      if (!memberData || Object.keys(memberData).length === 0) {
        throw new Error('Member data is required');
      }

      const newMember = {};
      for (let key in memberData) {
        newMember[key] = memberData[key];
      }

      const member = new memberModel(newMember);
      await member.save();

      logger.info('New member added successfully');
      return member;
    } catch (error) {
      logger.error('Error adding member:', error);
      throw error;
    }
  }

  /**
   * Delete a member by ID
   */
  async deleteMember(id) {
    try {
      if (!id) {
        throw new Error('Member ID is required');
      }

      const deletedMember = await memberModel.findOneAndDelete({ _id: id });

      if (!deletedMember) {
        throw new Error('Member not found');
      }

      logger.info(`Member deleted successfully: ${id}`);
      return deletedMember;
    } catch (error) {
      logger.error('Error deleting member:', error);
      throw error;
    }
  }

  /**
   * Get all members
   */
  async getMembers() {
    try {
      const members = await memberModel.find({});
      return members;
    } catch (error) {
      logger.error('Error fetching members:', error);
      throw error;
    }
  }

  /**
   * Update a member by ID
   */
  async updateMember(id, memberData) {
    try {
      if (!id) {
        throw new Error('Member ID is required');
      }

      if (!memberData || Object.keys(memberData).length === 0) {
        throw new Error('Member update data is required');
      }

      const updatedMember = {};
      for (let key in memberData) {
        updatedMember[key] = memberData[key];
      }

      const member = await memberModel.findOneAndUpdate(
        { _id: updatedMember.id },
        updatedMember,
        { new: true }
      );

      if (!member) {
        throw new Error('Member not found');
      }

      logger.info(`Member updated successfully: ${id}`);
      return member;
    } catch (error) {
      logger.error('Error updating member:', error);
      throw error;
    }
  }
}

module.exports = new BioService();
