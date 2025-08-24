const User = require('../models/User');
const logger = require('../utils/logger');

class UserService {
  /**
   * Get user by ID
   */
  async getUserById(id) {
    try {
      const user = await User.findById(id).select('-password');
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      logger.error('Error fetching user by ID:', error);
      throw error;
    }
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email) {
    try {
      const user = await User.findOne({ adminEmail: email.toLowerCase() });
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      logger.error('Error fetching user by email:', error);
      throw error;
    }
  }

  /**
   * Create a new user
   */
  async createUser(userData) {
    try {
      if (!userData.bandName || !userData.adminEmail || !userData.password) {
        throw new Error('Band name, admin email, and password are required');
      }

      // Check if user already exists
      const existingUser = await User.findOne({
        adminEmail: userData.adminEmail.toLowerCase(),
      });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const user = new User(userData);
      await user.save();

      logger.info('New user created successfully');
      return user;
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Update user information
   */
  async updateUser(id, updateData) {
    try {
      if (!id) {
        throw new Error('User ID is required');
      }

      // Remove password from update data if it's not being changed
      if (!updateData.password) {
        delete updateData.password;
      }

      const user = await User.findByIdAndUpdate(id, updateData, {
        new: true,
      }).select('-password');
      if (!user) {
        throw new Error('User not found');
      }

      logger.info(`User updated successfully: ${id}`);
      return user;
    } catch (error) {
      logger.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Authenticate user
   */
  async authenticateUser(email, password) {
    try {
      const user = await User.findOne({ adminEmail: email.toLowerCase() });
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      if (!user.isActive) {
        throw new Error('Account is deactivated');
      }

      return user;
    } catch (error) {
      logger.error('Error authenticating user:', error);
      throw error;
    }
  }

  /**
   * Set password reset token
   */
  async setPasswordResetToken(email) {
    try {
      const user = await User.findOne({ adminEmail: email.toLowerCase() });
      if (!user) {
        throw new Error('User not found');
      }

      const crypto = require('crypto');
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = Date.now() + 3600000; // 1 hour

      user.resetToken = resetToken;
      user.resetTokenExpiry = resetTokenExpiry;
      await user.save();

      logger.info(`Password reset token set for user: ${email}`);
      return { resetToken, resetTokenExpiry };
    } catch (error) {
      logger.error('Error setting password reset token:', error);
      throw error;
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token, newPassword) {
    try {
      const user = await User.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: Date.now() },
      });

      if (!user) {
        throw new Error('Invalid or expired reset token');
      }

      user.password = newPassword;
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      await user.save();

      logger.info(`Password reset successfully for user: ${user.adminEmail}`);
      return user;
    } catch (error) {
      logger.error('Error resetting password:', error);
      throw error;
    }
  }

  /**
   * Get the first/only user (for single-band setup)
   */
  async getFirstUser() {
    try {
      const user = await User.findOne().select('-password');
      if (!user) {
        throw new Error('No user found');
      }
      return user;
    } catch (error) {
      logger.error('Error fetching first user:', error);
      throw error;
    }
  }

  /**
   * Initialize default user if none exists
   */
  async initializeDefaultUser() {
    try {
      const existingUser = await User.findOne();
      if (existingUser) {
        logger.info('User already exists, skipping initialization');
        return existingUser;
      }

      const defaultUser = new User({
        bandName: process.env.DEFAULT_BAND_NAME || 'Logans Run',
        adminEmail: process.env.ADMIN_EMAIL || 'admin@logansrun.com',
        password: process.env.DEFAULT_ADMIN_PASSWORD || 'LogansRun2024!',
        adminPhone: process.env.ADMIN_PHONE || '',
        isActive: true,
      });

      await defaultUser.save();
      logger.warn(
        'Default user created. Please change the password immediately.'
      );
      return defaultUser;
    } catch (error) {
      logger.error('Error initializing default user:', error);
      throw error;
    }
  }
}

module.exports = new UserService();
