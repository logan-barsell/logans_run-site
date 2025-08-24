const userService = require('../services/userService');
const { AppError } = require('../middleware/errorHandler');

class UserController {
  /**
   * Get current user information
   */
  async getCurrentUser(req, res, next) {
    try {
      const user = await userService.getUserById(req.user.id);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(new AppError('Failed to fetch user information', 500));
    }
  }

  /**
   * Update user information
   */
  async updateUser(req, res, next) {
    try {
      const user = await userService.updateUser(req.user.id, req.body);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      if (error.message === 'User ID is required') {
        return next(new AppError('User ID is required', 400));
      }
      if (error.message === 'User not found') {
        return next(new AppError('User not found', 404));
      }
      next(new AppError('Failed to update user information', 500));
    }
  }

  /**
   * Initialize default user (admin only)
   */
  async initializeDefaultUser(req, res, next) {
    try {
      const user = await userService.initializeDefaultUser();
      res.status(200).json({
        success: true,
        data: user,
        message: 'Default user initialized successfully',
      });
    } catch (error) {
      next(new AppError('Failed to initialize default user', 500));
    }
  }
}

module.exports = new UserController();
