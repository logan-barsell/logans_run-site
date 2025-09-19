const bcrypt = require('bcrypt');
const { getConfig } = require('../config/app');
const UserService = require('./userService');
const TokenService = require('./tokenService');
const BandsyteEmailService = require('./bandsyteEmailService');
const ThemeService = require('./themeService');
const TwoFactorService = require('./twoFactorService');
const { AppError } = require('../middleware/errorHandler');
const redisClient = require('../utils/redisClient');
const logger = require('../utils/logger');
const { formatUser } = require('../utils/format/user-format');
const { hashValue } = require('../utils/hash');
const SessionService = require('./sessionService');
const {
  addDays,
  addHours,
  daysToSeconds,
  hoursToSeconds,
} = require('../utils/dates');

const login = async options => {
  const { tenantId, email, password, ip, userAgent } = options;

  const user = await UserService.findUserByEmail(tenantId, email);

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // Check if account is locked due to too many failed attempts
  if (UserService.checkAccountLocked(user)) {
    const remainingTime = UserService.getLockoutTimeRemaining(user);
    throw new AppError(
      `Account is temporarily locked due to too many failed login attempts. Try again in ${remainingTime} minutes.`,
      423 // Locked status code
    );
  }

  if (user.status === 'INACTIVE')
    throw new AppError('Account is inactive, please contact support', 403);

  const isAuthenticated = await bcrypt.compare(password, user.password);

  if (!isAuthenticated) {
    // Handle failed login attempt
    await UserService.handleFailedLogin(tenantId, user.id);
    throw new AppError('Invalid email or password', 401);
  }

  // Handle successful login (reset failed attempts)
  await UserService.handleSuccessfulLogin(tenantId, user.id);

  // Check if 2FA is enabled
  if (user.twoFactorEnabled) {
    // Automatically send 2FA code
    const theme = await ThemeService.getTheme(tenantId);
    const bandName = theme.siteTitle || 'Bandsyte';

    await TwoFactorService.sendTwoFactorCode(tenantId, user.id, bandName);

    // Return user info but require 2FA verification
    return {
      requiresTwoFactor: true,
      userId: user.id,
      user: formatUser(user),
      codeSent: true,
    };
  }

  // Proceed with normal login if 2FA is not enabled
  let session;
  try {
    session = await SessionService.createSession(tenantId, user.id, {
      ipAddress: ip,
      userAgent,
      expiresAt: addDays(7), // Expires in 7 days
    });
  } catch (error) {
    throw error;
  }

  const accessToken = TokenService.generateAccessToken({
    id: user.id,
    sessionId: session.sessionId,
  });
  const refreshToken = await TokenService.generateRefreshToken(
    {
      id: user.id,
      sessionId: session.sessionId,
    },
    ip,
    userAgent
  );
  return {
    accessToken,
    refreshToken,
    user: formatUser(user),
  };
};

const completeTwoFactorLogin = async options => {
  const { tenantId, userId, ip, userAgent } = options;

  const user = await UserService.findUserById(tenantId, userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.status === 'INACTIVE')
    throw new AppError('Account is inactive, please contact support', 403);

  if (!user.twoFactorEnabled) {
    throw new AppError('Two-factor authentication is not enabled', 400);
  }

  let session;
  try {
    session = await SessionService.createSession(tenantId, user.id, {
      ipAddress: ip,
      userAgent,
      expiresAt: addDays(7), // Expires in 7 days
    });
  } catch (error) {
    throw error;
  }

  const accessToken = TokenService.generateAccessToken({
    id: user.id,
    sessionId: session.sessionId,
  });
  const refreshToken = await TokenService.generateRefreshToken(
    {
      id: user.id,
      sessionId: session.sessionId,
    },
    ip,
    userAgent
  );
  return {
    accessToken,
    refreshToken,
    user: formatUser(user),
  };
};

const signup = async options => {
  const { tenantId, email, password, ip, userAgent } = options;

  const existingUser = await UserService.findUserByEmail(tenantId, email);

  if (existingUser) {
    throw new AppError('Email is already in use', 400);
  }

  const newUser = await UserService.createUser(tenantId, {
    adminEmail: email,
    password,
    role: 'USER',
  });

  if (!newUser) {
    throw new AppError('There was a problem signing up, please try again', 500);
  }

  // send email for account verification
  await sendEmailVerificationWithToken(
    tenantId,
    newUser.id,
    newUser.adminEmail
  );

  await SessionService.createSession(tenantId, newUser.id, {
    ipAddress: ip,
    userAgent,
    expiresAt: addDays(7), // Expires in 7 days
  });

  const accessToken = TokenService.generateAccessToken({
    id: newUser.id,
    role: newUser.role,
  });
  const refreshToken = await TokenService.generateRefreshToken(
    {
      id: newUser.id,
      role: newUser.role,
    },
    ip,
    userAgent
  );

  return {
    accessToken,
    refreshToken,
    user: formatUser(newUser),
  };
};

// Send Verification Email (tenant-aware)
async function sendEmailVerificationWithToken(
  tenantId,
  userId,
  email,
  role = 'USER'
) {
  const expiresAt = addDays(3); // 3 days from now
  const verificationToken = TokenService.generateSignedToken({
    tenantId,
    userId,
    expiresAt,
  });
  // save token in redis
  const hashedToken = hashValue(verificationToken);
  const TOKEN_EXPIRY = daysToSeconds(3); // Expires in 3 days
  // Store token in Redis with user ID
  await redisClient.set(
    `email-verify:${userId}`,
    JSON.stringify({ hashedToken, email, tenantId }),
    {
      EX: TOKEN_EXPIRY,
    }
  );

  // Get the actual band name from theme
  const theme = await ThemeService.getTheme(tenantId);
  const config = await getConfig(tenantId);
  const bandName = theme.siteTitle || config.appName;

  // Send verification email
  const verificationLink = `${config.clientURL}/auth/verify-email?token=${verificationToken}`;
  await BandsyteEmailService.sendEmailVerificationWithBranding(
    email,
    verificationLink,
    role,
    bandName
  );
}

// Verify Email
async function verifyEmail(token) {
  const payload = TokenService.verifySignedToken(token);
  if (!payload) {
    logger.warn(`⚠️ Invalid or expired email verification token used`);
    throw new AppError('Invalid or expired email verification link', 400);
  }

  const storedData = await redisClient.get(`email-verify:${payload.userId}`);
  if (!storedData)
    throw new AppError('Invalid or expired email verification link', 400);

  const {
    hashedToken,
    email,
    tenantId: storedTenantId,
  } = JSON.parse(storedData);

  if (!hashedToken || hashedToken !== hashValue(token)) {
    logger.warn(`⚠️ Email verification failed due to token mismatch`);
    throw new AppError('Invalid email verification token', 400);
  }

  // Delete the token from Redis
  await redisClient.del(`email-verify:${payload.userId}`);

  // Determine tenantId (prefer token, fallback to stored data)
  const tenantId = payload.tenantId || storedTenantId;
  if (!tenantId) {
    throw new AppError('Tenant not found for verification', 400);
  }

  // Verify User and update email if needed
  const updates = { verified: true, adminEmail: email };
  return await UserService.updateUser(tenantId, payload.userId, updates);
}

// Request Password Reset (tenant-aware)
async function requestPasswordReset(tenantId, email) {
  const user = await UserService.getUserByEmail(tenantId, email);
  if (!user) {
    logger.warn(
      `⚠️ Password reset requested for non-existent email: ${hashValue(
        email,
        true
      )}`
    );
    return; // Do not reveal if email exists
  }

  // Generate a secure reset token
  const expiresAt = addHours(1); // 1 hour from now
  const resetToken = TokenService.generateSignedToken({
    tenantId,
    userId: user.id,
    expiresAt,
  });
  const hashedToken = hashValue(resetToken);

  const RESET_TOKEN_EXPIRY = hoursToSeconds(1); // 1 hour
  // Store token in Redis with user ID
  await redisClient.set(
    `password-reset:${user.id}`,
    JSON.stringify({ hashedToken, tenantId }),
    {
      EX: RESET_TOKEN_EXPIRY,
    }
  );

  // Get the actual band name from theme
  const theme = await ThemeService.getTheme(tenantId);
  const config = await getConfig(tenantId);
  const bandName = theme.siteTitle || config.appName;

  // Send reset email
  const resetUrl = `${config.clientURL}/reset-password?token=${resetToken}`;
  await BandsyteEmailService.sendPasswordResetWithBranding(
    user.adminEmail,
    resetUrl,
    bandName,
    tenantId
  );
  logger.info(`📧 Password reset email sent to user ${user.id}`);
}

async function resetPassword(tenantId, token, newPassword) {
  const payload = TokenService.verifySignedToken(token);

  if (!payload) {
    logger.warn(`⚠️ Invalid or expired password reset token used`);
    throw new AppError('Invalid or expired reset token', 400);
  }

  // Retrieve stored hash & tenant
  const stored = await redisClient.get(`password-reset:${payload.userId}`);
  if (!stored) {
    logger.warn(`⚠️ Password reset attempt failed due to token missing`);
    throw new AppError('Invalid reset token', 400);
  }
  const { hashedToken, tenantId: storedTenantId } = JSON.parse(stored);
  if (!hashedToken || hashedToken !== hashValue(token)) {
    logger.warn(`⚠️ Password reset attempt failed due to token mismatch`);
    throw new AppError('Invalid reset token', 400);
  }

  // Get user details for email notification
  const resolvedTenantId = payload.tenantId || storedTenantId || tenantId;
  if (!resolvedTenantId) {
    throw new AppError('Tenant not found for password reset', 400);
  }
  const user = await UserService.findUserById(resolvedTenantId, payload.userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Update user with the new password
  await UserService.saveNewPassword(
    resolvedTenantId,
    payload.userId,
    newPassword
  );

  // Delete the token from Redis
  await redisClient.del(`password-reset:${payload.userId}`);

  // Get the actual band name from theme
  const theme = await ThemeService.getTheme(resolvedTenantId);
  const config = await getConfig(resolvedTenantId);
  const bandName = theme.siteTitle || config.appName;

  // Send success notification email
  await BandsyteEmailService.sendPasswordResetSuccessWithBranding(
    user.adminEmail,
    bandName,
    new Date().toISOString(),
    resolvedTenantId
  );

  logger.info(`🔑 Password successfully reset for user ${payload.userId}`);
}

const AuthService = {
  login,
  completeTwoFactorLogin,
  signup,
  sendEmailVerificationWithToken,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
};

module.exports = AuthService;
