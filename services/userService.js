const User = require('../models/User');
const bcrypt = require('bcrypt');
const logger = require('../utils/logger');
const {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
} = require('../utils/validation');
const { generatePasswordHash } = require('../utils/hash');
const { AppError } = require('../middleware/errorHandler');
const { formatUser } = require('../utils/format/user-format');
const SessionService = require('./sessionService');
const TokenService = require('./tokenService');

const baseFields = {
  uuid: true,
  firstName: true,
  lastName: true,
  fullName: true,
  adminEmail: true,
  adminPhone: true,
  status: true,
  verified: true,
  role: true,
  userType: true,
  invitedByUUID: true,
  createdAt: true,
  updatedAt: true,
};

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
   * Find user by UUID
   */
  async findUserByUUID(uuid) {
    try {
      const user = await User.findById(uuid);
      return user;
    } catch (error) {
      logger.error('Error fetching user by UUID:', error);
      return null;
    }
  }

  /**
   * Find user by ID
   */
  async findUserById(id) {
    try {
      const user = await User.findById(id);
      return user;
    } catch (error) {
      logger.error('Error fetching user by ID:', error);
      return null;
    }
  }

  /**
   * Find user by email (alias for getUserByEmail)
   */
  async findUserByEmail(email) {
    return this.getUserByEmail(email);
  }

  /**
   * Create a new user
   */
  async createUser(userData) {
    try {
      if (!userData.adminEmail || !userData.password) {
        throw new Error('Admin email and password are required');
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
   * Update user with identifier (ID or UUID)
   */
  async updateUserWithIdentifier(identifier, updates, useId = false) {
    try {
      const { adminEmail, adminPhone } = updates;

      if (adminEmail && !validateEmail(adminEmail)) {
        throw new AppError('Invalid email format', 400);
      }

      if (adminPhone && !validatePhoneNumber(adminPhone)) {
        throw new AppError('Invalid phone format', 400);
      }

      const user = await User.findByIdAndUpdate(identifier, updates, {
        new: true,
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        error.message || 'Error updating user',
        error.statusCode || 500
      );
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

      if (!user.isActive || user.status === 'INACTIVE') {
        throw new Error('Account is deactivated');
      }

      return user;
    } catch (error) {
      logger.error('Error authenticating user:', error);
      throw error;
    }
  }

  /**
   * Updates a user's password securely.
   * @param {string} userId - The ID of the user whose password is being updated.
   * @param {string} newPassword - The new password in plain text.
   */
  async saveNewPassword(userId, newPassword) {
    if (!validatePassword(newPassword)) {
      throw new AppError(
        'Password must have at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character.',
        400
      );
    }
    const passwordHash = await generatePasswordHash(newPassword);

    const user = await User.findByIdAndUpdate(
      userId,
      { password: passwordHash },
      { new: true }
    ).select(baseFields);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    logger.info(`🔐 Password updated successfully for user ${userId}`);
    return user;
  }

  /**
   * Update password with current password verification
   */
  async updatePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId);
    if (!user) {
      logger.warn(`🔒 Password change failed: User ${userId} not found`);
      throw new AppError('User not found', 404);
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      logger.warn(`⚠️ Incorrect current password for user ${userId}`);
      throw new AppError('Invalid credentials', 400);
    }

    return await this.saveNewPassword(userId, newPassword);
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
   * Find users with filtering and pagination
   */
  async findUsers(options = {}) {
    const {
      search,
      type,
      page = 1,
      limit = 10,
      verified,
      status,
      role,
      userType,
    } = options;

    const where = {};

    // Apply search filtering (checks name(s) & email)
    const searchTerm = search?.trim();
    if (searchTerm) {
      where.$or = [
        { adminEmail: { $regex: searchTerm, $options: 'i' } },
        { fullName: { $regex: searchTerm, $options: 'i' } },
      ];
    }

    // Apply type filtering
    if (type === 'admins') {
      if (role) {
        where.role = role;
      } else {
        where.role = { $in: ['ADMIN', 'SUPERADMIN'] };
      }
    } else if (type === 'users') {
      where.role = 'USER';
    } else if (role) {
      where.role = role;
    }

    if (verified !== null && verified !== undefined) {
      where.verified = verified;
    }

    if (status) {
      where.status = status;
    }

    if (role) {
      where.role = role;
    }

    if (userType) {
      where.userType = userType;
    }

    // Fetch total count before pagination
    const total = await User.countDocuments(where);

    // Fetch users with pagination
    const users = await User.find(where)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .select(baseFields);

    return { users, total };
  }

  /**
   * Deactivate user
   */
  async deactivateUser(uuid, adminId) {
    const updated = await this.updateUserWithIdentifier(
      uuid,
      {
        status: 'INACTIVE',
        verified: false,
        deactivatedByUUID: adminId,
        deactivatedAt: new Date(),
      },
      false
    );
    await this.endAllUserSessions(updated._id.toString(), true);
    return updated;
  }

  /**
   * End all user sessions
   */
  async endAllUserSessions(identifier, useId = false) {
    let id;
    if (useId) {
      id = identifier;
    } else {
      const user = await this.findUserByUUID(identifier);
      if (!user) throw new AppError('User not found', 404);
      id = user._id.toString();
    }

    await SessionService.endAllSessions(id);
    await TokenService.revokeRefreshTokens(id);
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
        bandName: process.env.DEFAULT_BAND_NAME || 'Bandsyte',
        adminEmail: process.env.ADMIN_EMAIL || 'admin@bandsyte.com',
        password: process.env.DEFAULT_ADMIN_PASSWORD || 'Bandsyte2024!',
        adminPhone: process.env.ADMIN_PHONE || '',
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        userType: 'ADMIN',
        status: 'ACTIVE',
        verified: true,
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
