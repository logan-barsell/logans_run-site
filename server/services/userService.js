const bcrypt = require('bcrypt');
const crypto = require('crypto');
const logger = require('../utils/logger');
const {
  validateEmail,
  validatePasswordDetailed,
  validatePhoneNumber,
} = require('../utils/validation');
const { generatePasswordHash } = require('../utils/hash');
const { AppError } = require('../middleware/errorHandler');
// Removed TokenService import to break circular dependency
const { withTenant } = require('../db/withTenant');
const { whitelistFields } = require('../utils/fieldWhitelist');

// Allowed fields for create/update
const USER_CREATE_FIELDS = [
  'bandName',
  'adminEmail',
  'adminPhone',
  'password',
  'role',
  'status',
  'verified',
  'invitedByUUID',
  'deactivatedByUUID',
  'deactivatedAt',
  'twoFactorEnabled',
  'twoFactorCode',
  'twoFactorCodeExpiry',
  'securityPreferences',
  'isActive',
];

const USER_UPDATE_FIELDS = [
  'bandName',
  'adminEmail',
  'adminPhone',
  'role',
  'status',
  'verified',
  'invitedByUUID',
  'deactivatedByUUID',
  'deactivatedAt',
  'twoFactorEnabled',
  'twoFactorCode',
  'twoFactorCodeExpiry',
  'securityPreferences',
  'isActive',
];

// Account lockout policy
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;

// Account lockout helpers
function checkAccountLocked(user) {
  if (!user) return false;
  return !!(user.lockedUntil && new Date(user.lockedUntil) > new Date());
}

function getLockoutTimeRemaining(user) {
  if (!checkAccountLocked(user)) return 0;
  const diffMs = new Date(user.lockedUntil) - new Date();
  return Math.ceil(diffMs / (1000 * 60));
}

async function handleFailedLogin(tenantId, userId) {
  try {
    return await withTenant(tenantId, async tx => {
      const existing = await tx.user.findUnique({ where: { id: userId } });
      if (!existing) throw new AppError('User not found', 404);

      const nextAttempts = (existing.failedLoginAttempts || 0) + 1;
      const shouldLock = nextAttempts >= MAX_FAILED_ATTEMPTS;
      const updates = shouldLock
        ? {
            failedLoginAttempts: 0,
            lockedUntil: new Date(
              Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000
            ),
            lastFailedLogin: new Date(),
          }
        : {
            failedLoginAttempts: nextAttempts,
            lastFailedLogin: new Date(),
          };

      return await tx.user.update({ where: { id: userId }, data: updates });
    });
  } catch (error) {
    throw new AppError(
      error.message || 'Error handling failed login',
      error.statusCode || 500
    );
  }
}

async function handleSuccessfulLogin(tenantId, userId) {
  try {
    return await withTenant(tenantId, async tx => {
      const existing = await tx.user.findUnique({ where: { id: userId } });
      if (!existing) throw new AppError('User not found', 404);
      return await tx.user.update({
        where: { id: userId },
        data: {
          failedLoginAttempts: 0,
          lockedUntil: null,
          lastFailedLogin: null,
        },
      });
    });
  } catch (error) {
    throw new AppError(
      error.message || 'Error handling successful login',
      error.statusCode || 500
    );
  }
}

/**
 * Get user by ID
 */
async function getUserById(tenantId, id) {
  try {
    const user = await withTenant(tenantId, async tx => {
      return await tx.user.findUnique({ where: { id } });
    });
    if (!user) {
      throw new AppError('User not found', 404);
    }
    const { password, ...safeUser } = user;
    return safeUser;
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
async function getUserByEmail(tenantId, email) {
  try {
    const normalized = email.toLowerCase();
    const user = await withTenant(tenantId, async tx => {
      return await tx.user.findUnique({ where: { adminEmail: normalized } });
    });
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
 * Find user by email, return null if not found (non-throwing)
 */
async function findUserByEmail(tenantId, email) {
  try {
    const normalized = email.toLowerCase();
    const user = await withTenant(tenantId, async tx => {
      // Explicitly include tenantId in the query for additional security
      // RLS will also enforce this, but this makes it explicit
      return await tx.user.findUnique({
        where: {
          adminEmail: normalized,
          tenantId: tenantId, // Explicit tenant validation
        },
      });
    });
    return user || null;
  } catch (error) {
    logger.error('Error finding user by email:', error);
    return null;
  }
}

/**
 * Find user by ID
 */
async function findUserById(tenantId, id) {
  try {
    const user = await withTenant(tenantId, async tx => {
      return await tx.user.findUnique({ where: { id } });
    });
    return user || null;
  } catch (error) {
    logger.error('Error fetching user by ID:', error);
    return null;
  }
}

/**
 * Create a new user
 */
async function createUser(tenantId, userData) {
  try {
    if (!userData.adminEmail || !userData.password) {
      throw new AppError('Admin email and password are required', 400);
    }
    const normalizedEmail = userData.adminEmail.toLowerCase();

    return await withTenant(tenantId, async tx => {
      // Global uniqueness by email
      const existingByEmail = await tx.user.findUnique({
        where: { adminEmail: normalizedEmail },
      });
      if (existingByEmail) {
        throw new AppError('User with this email already exists', 400);
      }

      // One user per tenant
      const existingForTenant = await tx.user.findUnique({
        where: { tenantId },
      });
      if (existingForTenant) {
        throw new AppError('User already exists for this tenant', 400);
      }

      // Validate optional fields
      if (userData.adminPhone && !validatePhoneNumber(userData.adminPhone)) {
        throw new AppError('Invalid phone format', 400);
      }

      // Prepare data
      const data = whitelistFields(
        {
          ...userData,
          adminEmail: normalizedEmail,
        },
        USER_CREATE_FIELDS
      );
      data.tenantId = tenantId;

      // Password hashing
      const passwordValidation = validatePasswordDetailed(userData.password);
      if (!passwordValidation.isValid) {
        throw new AppError(passwordValidation.errors.join('. '), 400);
      }
      data.password = await generatePasswordHash(userData.password);

      const user = await tx.user.create({ data });
      logger.info('New user created successfully');
      return user;
    });
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
async function updateUser(tenantId, id, updateData) {
  try {
    if (!id) {
      throw new AppError('User ID is required', 400);
    }
    const data = whitelistFields({ ...updateData }, USER_UPDATE_FIELDS);
    if (data.adminEmail && !validateEmail(data.adminEmail)) {
      throw new AppError('Invalid email format', 400);
    }
    if (data.adminPhone && !validatePhoneNumber(data.adminPhone)) {
      throw new AppError('Invalid phone format', 400);
    }

    return await withTenant(tenantId, async tx => {
      const existing = await tx.user.findUnique({ where: { id } });
      if (!existing) throw new AppError('User not found', 404);
      const updated = await tx.user.update({ where: { id }, data });
      logger.info(`User updated successfully: ${id}`);
      const { password, ...safeUser } = updated;
      return safeUser;
    });
  } catch (error) {
    logger.error('Error updating user:', error);
    throw new AppError(
      error.message || 'Error updating user',
      error.statusCode || 500
    );
  }
}

/**
 * Updates a user's password securely.
 * @param {string} userId - The ID of the user whose password is being updated.
 * @param {string} newPassword - The new password in plain text.
 */
async function saveNewPassword(tenantId, userId, newPassword) {
  try {
    // Use detailed password validation for better error messages
    const passwordValidation = validatePasswordDetailed(newPassword);
    if (!passwordValidation.isValid) {
      throw new AppError(passwordValidation.errors.join('. '), 400);
    }
    const passwordHash = await generatePasswordHash(newPassword);

    return await withTenant(tenantId, async tx => {
      const existing = await tx.user.findUnique({ where: { id: userId } });
      if (!existing) throw new AppError('User not found', 404);
      const updated = await tx.user.update({
        where: { id: userId },
        data: { password: passwordHash },
      });
      logger.info(`🔐 Password updated successfully for user ${userId}`);
      const { password, ...safeUser } = updated;
      return safeUser;
    });
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
async function updatePassword(tenantId, userId, currentPassword, newPassword) {
  try {
    const user = await withTenant(tenantId, async tx => {
      return await tx.user.findUnique({ where: { id: userId } });
    });
    if (!user) {
      logger.warn(`🔒 Password change failed: User ${userId} not found`);
      throw new AppError('User not found', 404);
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      logger.warn(`⚠️ Incorrect current password for user ${userId}`);
      throw new AppError('Invalid credentials', 400);
    }

    return await saveNewPassword(tenantId, userId, newPassword);
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
async function setPasswordResetToken(tenantId, email) {
  try {
    const user = await withTenant(tenantId, async tx => {
      return await tx.user.findUnique({
        where: { adminEmail: email.toLowerCase() },
      });
    });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    await withTenant(tenantId, async tx => {
      await tx.user.update({
        where: { id: user.id },
        data: { resetToken, resetTokenExpiry },
      });
    });

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
async function resetPassword(tenantId, token, newPassword) {
  try {
    const user = await withTenant(tenantId, async tx => {
      return await tx.user.findFirst({
        where: {
          resetToken: token,
          resetTokenExpiry: { gt: new Date() },
        },
      });
    });

    if (!user) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    const passwordValidation = validatePasswordDetailed(newPassword);
    if (!passwordValidation.isValid) {
      throw new AppError(passwordValidation.errors.join('. '), 400);
    }
    const passwordHash = await generatePasswordHash(newPassword);

    await withTenant(tenantId, async tx => {
      await tx.user.update({
        where: { id: user.id },
        data: {
          password: passwordHash,
          resetToken: null,
          resetTokenExpiry: null,
        },
      });
    });

    logger.info(`Password reset successfully for user: ${user.adminEmail}`);
    return { id: user.id, adminEmail: user.adminEmail };
  } catch (error) {
    logger.error('Error resetting password:', error);
    throw new AppError(
      error.message || 'Error resetting password',
      error.statusCode || 500
    );
  }
}

module.exports = {
  getUserById,
  getUserByEmail,
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
  saveNewPassword,
  updatePassword,
  setPasswordResetToken,
  resetPassword,
  checkAccountLocked,
  getLockoutTimeRemaining,
  handleFailedLogin,
  handleSuccessfulLogin,
};
