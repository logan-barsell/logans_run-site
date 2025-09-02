const User = require('../models/User');
const Session = require('../models/Session');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const logger = require('../utils/logger');
const {
  validateEmail,
  validatePassword,
  validatePasswordDetailed,
  validatePhoneNumber,
} = require('../utils/validation');
const { generatePasswordHash } = require('../utils/hash');
const { AppError } = require('../middleware/errorHandler');
const TokenService = require('./tokenService');

const baseFields = {
  uuid: true,
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

/**
 * Get user by ID
 */
async function getUserById(id) {
  try {
    const user = await User.findById(id).select('-password');
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  } catch (error) {
    logger.error('Error fetching user by ID:', error);
    throw new AppError(
      error.message || 'Error fetching user by ID',
      error.statusCode || 500
    );
  }
}

/**
 * Get user by email
 */
async function getUserByEmail(email) {
  try {
    const user = await User.findOne({ adminEmail: email.toLowerCase() });
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  } catch (error) {
    logger.error('Error fetching user by email:', error);
    throw new AppError(
      error.message || 'Error fetching user by email',
      error.statusCode || 500
    );
  }
}

/**
 * Find user by UUID
 */
async function findUserByUUID(uuid) {
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
async function findUserById(id) {
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
async function findUserByEmail(email) {
  return getUserByEmail(email);
}

/**
 * Create a new user
 */
async function createUser(userData) {
  try {
    if (!userData.adminEmail || !userData.password) {
      throw new AppError('Admin email and password are required', 400);
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      adminEmail: userData.adminEmail.toLowerCase(),
    });
    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }

    const user = new User(userData);
    await user.save();

    logger.info('New user created successfully');
    return user;
  } catch (error) {
    logger.error('Error creating user:', error);
    throw new AppError(
      error.message || 'Error creating user',
      error.statusCode || 500
    );
  }
}

/**
 * Update user information
 */
async function updateUser(id, updateData) {
  try {
    if (!id) {
      throw new AppError('User ID is required', 400);
    }

    // Remove password from update data if it's not being changed
    if (!updateData.password) {
      delete updateData.password;
    }

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    }).select('-password');
    if (!user) {
      throw new AppError('User not found', 404);
    }

    logger.info(`User updated successfully: ${id}`);
    return user;
  } catch (error) {
    logger.error('Error updating user:', error);
    throw new AppError(
      error.message || 'Error updating user',
      error.statusCode || 500
    );
  }
}

/**
 * Update user with identifier (ID or UUID)
 */
async function updateUserWithIdentifier(identifier, updates, useId = false) {
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
    throw new AppError(
      error.message || 'Error updating user',
      error.statusCode || 500
    );
  }
}

/**
 * Authenticate user
 */
async function authenticateUser(email, password) {
  try {
    const user = await User.findOne({ adminEmail: email.toLowerCase() });
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    if (!user.isActive || user.status === 'INACTIVE') {
      throw new AppError('Account is deactivated', 403);
    }

    return user;
  } catch (error) {
    logger.error('Error authenticating user:', error);
    throw new AppError(
      error.message || 'Error authenticating user',
      error.statusCode || 500
    );
  }
}

/**
 * Updates a user's password securely.
 * @param {string} userId - The ID of the user whose password is being updated.
 * @param {string} newPassword - The new password in plain text.
 */
async function saveNewPassword(userId, newPassword) {
  try {
    // Use detailed password validation for better error messages
    const passwordValidation = validatePasswordDetailed(newPassword);
    if (!passwordValidation.isValid) {
      throw new AppError(passwordValidation.errors.join('. '), 400);
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
  } catch (error) {
    logger.error('Error saving new password:', error);
    throw new AppError(
      error.message || 'Error saving new password',
      error.statusCode || 500
    );
  }
}

/**
 * Update password with current password verification
 */
async function updatePassword(userId, currentPassword, newPassword) {
  try {
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

    return await saveNewPassword(userId, newPassword);
  } catch (error) {
    logger.error('Error updating password:', error);
    throw new AppError(
      error.message || 'Error updating password',
      error.statusCode || 500
    );
  }
}

/**
 * Set password reset token
 */
async function setPasswordResetToken(email) {
  try {
    const user = await User.findOne({ adminEmail: email.toLowerCase() });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    logger.info(`Password reset token set for user: ${email}`);
    return { resetToken, resetTokenExpiry };
  } catch (error) {
    logger.error('Error setting password reset token:', error);
    throw new AppError(
      error.message || 'Error setting password reset token',
      error.statusCode || 500
    );
  }
}

/**
 * Reset password with token
 */
async function resetPassword(token, newPassword) {
  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    logger.info(`Password reset successfully for user: ${user.adminEmail}`);
    return user;
  } catch (error) {
    logger.error('Error resetting password:', error);
    throw new AppError(
      error.message || 'Error resetting password',
      error.statusCode || 500
    );
  }
}

/**
 * Find users with filtering and pagination
 */
async function findUsers(options = {}) {
  try {
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

    // Apply search filtering (checks email)
    const searchTerm = search?.trim();
    if (searchTerm) {
      where.$or = [{ adminEmail: { $regex: searchTerm, $options: 'i' } }];
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
  } catch (error) {
    logger.error('Error finding users:', error);
    throw new AppError(
      error.message || 'Error finding users',
      error.statusCode || 500
    );
  }
}

/**
 * Deactivate user
 */
async function deactivateUser(uuid, adminId) {
  try {
    const updated = await updateUserWithIdentifier(
      uuid,
      {
        status: 'INACTIVE',
        verified: false,
        deactivatedByUUID: adminId,
        deactivatedAt: new Date(),
      },
      false
    );
    await endAllUserSessions(updated._id.toString(), true);
    return updated;
  } catch (error) {
    logger.error('Error deactivating user:', error);
    throw new AppError(
      error.message || 'Error deactivating user',
      error.statusCode || 500
    );
  }
}

/**
 * End all user sessions
 */
async function endAllUserSessions(identifier, useId = false) {
  try {
    let id;
    if (useId) {
      id = identifier;
    } else {
      const user = await findUserByUUID(identifier);
      if (!user) throw new AppError('User not found', 404);
      id = user._id.toString();
    }

    // End all sessions for this user
    const sessions = await Session.find({ userId: id, isActive: true });
    for (const session of sessions) {
      const now = new Date();
      const logoutTime = session.expiresAt < now ? session.expiresAt : now;
      await Session.findByIdAndUpdate(session._id, {
        logoutTime,
        isActive: false,
      });
    }

    await TokenService.revokeRefreshTokens(id);
  } catch (error) {
    logger.error('Error ending all user sessions:', error);
    throw new AppError(
      error.message || 'Error ending all user sessions',
      error.statusCode || 500
    );
  }
}

/**
 * Get the first/only user (for single-band setup)
 */
async function getFirstUser() {
  try {
    const user = await User.findOne().select('-password');
    if (!user) {
      throw new AppError('No user found', 404);
    }
    return user;
  } catch (error) {
    logger.error('Error fetching first user:', error);
    throw new AppError(
      error.message || 'Error fetching first user',
      error.statusCode || 500
    );
  }
}

/**
 * Initialize default user if none exists
 */
async function initializeDefaultUser() {
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
    throw new AppError(
      error.message || 'Error initializing default user',
      error.statusCode || 500
    );
  }
}

module.exports = {
  getUserById,
  getUserByEmail,
  findUserByUUID,
  findUserById,
  findUserByEmail,
  createUser,
  updateUser,
  updateUserWithIdentifier,
  authenticateUser,
  saveNewPassword,
  updatePassword,
  setPasswordResetToken,
  resetPassword,
  findUsers,
  deactivateUser,
  endAllUserSessions,
  getFirstUser,
  initializeDefaultUser,
};
