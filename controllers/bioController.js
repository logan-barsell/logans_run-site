const bioService = require('../services/bioService');
const { AppError } = require('../middleware/errorHandler');

class BioController {
  /**
   * Get bio information
   */
  async getBio(req, res, next) {
    try {
      const bio = await bioService.getBio();
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
  async updateBio(req, res, next) {
    try {
      const content = req.body.data;
      const result = await bioService.updateBio(content);
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
  async addMember(req, res, next) {
    try {
      const result = await bioService.addMember(req.body);
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
  async deleteMember(req, res, next) {
    try {
      const result = await bioService.deleteMember(req.params.id);
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
  async getMembers(req, res, next) {
    try {
      const members = await bioService.getMembers();
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
  async updateMember(req, res, next) {
    try {
      const result = await bioService.updateMember(req.params.id, req.body);
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
}

module.exports = new BioController();
