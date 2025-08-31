const bcrypt = require('bcrypt');
const config = require('../config');
const UserService = require('./userService');
const TokenService = require('./tokenService');
const EmailService = require('./emailService');
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
  const { email, password, ip, userAgent } = options;

  const user = await UserService.findUserByEmail(email);

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  if (user.status === 'INACTIVE')
    throw new AppError('Account is inactive, please contact support', 403);

  const isAuthenticated = await bcrypt.compare(password, user.password);

  if (!isAuthenticated) {
    throw new AppError('Invalid email or password', 401);
  }

  // Check if 2FA is enabled
  if (user.twoFactorEnabled) {
    // Automatically send 2FA code
    const theme = await ThemeService.getTheme();
    const bandName = theme.siteTitle || 'Bandsyte';

    await TwoFactorService.sendTwoFactorCode(user._id.toString(), bandName);

    // Return user info but require 2FA verification
    return {
      requiresTwoFactor: true,
      userId: user._id.toString(),
      user: formatUser(user),
      codeSent: true,
    };
  }

  // Proceed with normal login if 2FA is not enabled
  let session;
  try {
    session = await SessionService.createSession(user._id.toString(), {
      ipAddress: ip,
      userAgent,
      expiresAt: addDays(7), // Expires in 7 days
    });
  } catch (error) {
    throw error;
  }

  const accessToken = TokenService.generateAccessToken({
    id: user._id.toString(),
    uuid: user.uuid,
    sessionId: session.sessionId,
  });
  const refreshToken = await TokenService.generateRefreshToken(
    {
      id: user._id.toString(),
      uuid: user.uuid,
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
  const { userId, ip, userAgent } = options;

  const user = await UserService.findUserById(userId);

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
    session = await SessionService.createSession(user._id.toString(), {
      ipAddress: ip,
      userAgent,
      expiresAt: addDays(7), // Expires in 7 days
    });
  } catch (error) {
    throw error;
  }

  const accessToken = TokenService.generateAccessToken({
    id: user._id.toString(),
    uuid: user.uuid,
    sessionId: session.sessionId,
  });
  const refreshToken = await TokenService.generateRefreshToken(
    {
      id: user._id.toString(),
      uuid: user.uuid,
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
  const { email, password, userType = 'USER', ip, userAgent } = options;

  const existingUser = await UserService.findUserByEmail(email);

  if (existingUser) {
    throw new AppError('Email is already in use', 400);
  }

  const newUser = await UserService.createUser({
    adminEmail: email,
    password,
    role: 'USER',
    userType,
  });

  if (!newUser) {
    throw new AppError('There was a problem signing up, please try again', 500);
  }

  // send email for account verification
  await sendEmailVerificationWithToken(
    newUser._id.toString(),
    newUser.adminEmail
  );

  await SessionService.createSession(newUser._id.toString(), {
    ipAddress: ip,
    userAgent,
    expiresAt: addDays(7), // Expires in 7 days
  });

  const accessToken = TokenService.generateAccessToken({
    id: newUser._id.toString(),
    uuid: newUser.uuid,
    role: newUser.role,
    userType: newUser.userType,
  });
  const refreshToken = await TokenService.generateRefreshToken(
    {
      id: newUser._id.toString(),
      uuid: newUser.uuid,
      role: newUser.role,
      userType: newUser.userType,
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

// Send Verification Email
async function sendEmailVerificationWithToken(userId, email, role = 'USER') {
  const expiresAt = addDays(3); // 3 days from now
  const verificationToken = TokenService.generateSignedToken({
    userId,
    expiresAt,
  });
  // save token in redis
  const hashedToken = hashValue(verificationToken);
  const TOKEN_EXPIRY = daysToSeconds(3); // Expires in 3 days
  // Store token in Redis with user ID
  await redisClient.set(
    `email-verify:${userId}`,
    JSON.stringify({ hashedToken, email }),
    {
      EX: TOKEN_EXPIRY,
    }
  );

  // Get the actual band name from theme
  const theme = await ThemeService.getTheme();
  const bandName = theme.siteTitle || config.appName;

  // Send verification email
  const verificationLink = `${config.clientURL}/auth/verify-email?token=${verificationToken}`;
  await EmailService.sendEmailVerification(
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

  const { hashedToken, email } = JSON.parse(storedData);

  if (!hashedToken || hashedToken !== hashValue(token)) {
    logger.warn(`⚠️ Email verification failed due to token mismatch`);
    throw new AppError('Invalid email verification token', 400);
  }

  // Delete the token from Redis
  await redisClient.del(`email-verify:${payload.userId}`);

  // Verify User and update email if needed
  const updates = { verified: true, adminEmail: email };
  return await UserService.updateUserWithIdentifier(
    payload.userId,
    updates,
    true
  );
}

// Request Password Reset
async function requestPasswordReset(email) {
  const user = await UserService.findUserByEmail(email);
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
    userId: user._id.toString(),
    expiresAt,
  });
  const hashedToken = hashValue(resetToken);

  const RESET_TOKEN_EXPIRY = hoursToSeconds(1); // 1 hour
  // Store token in Redis with user ID
  await redisClient.set(`password-reset:${user._id}`, hashedToken, {
    EX: RESET_TOKEN_EXPIRY,
  });

  // Get the actual band name from theme
  const theme = await ThemeService.getTheme();
  const bandName = theme.siteTitle || config.appName;

  // Send reset email
  const resetUrl = `${config.clientURL}/reset-password?token=${resetToken}`;
  await EmailService.sendPasswordReset(user.adminEmail, resetUrl, bandName);
  logger.info(`📧 Password reset email sent to user ${user._id}`);
}

async function resetPassword(token, newPassword) {
  const payload = TokenService.verifySignedToken(token);

  if (!payload) {
    logger.warn(`⚠️ Invalid or expired password reset token used`);
    throw new AppError('Invalid or expired reset token', 400);
  }

  // Retrieve stored hash & user ID
  const hashedToken = await redisClient.get(`password-reset:${payload.userId}`);
  if (!hashedToken || hashedToken !== hashValue(token)) {
    logger.warn(`⚠️ Password reset attempt failed due to token mismatch`);
    throw new AppError('Invalid reset token', 400);
  }

  // Get user details for email notification
  const user = await UserService.findUserById(payload.userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Update user with the new password
  const { uuid } = await UserService.saveNewPassword(
    payload.userId,
    newPassword
  );

  // Delete the token from Redis
  await redisClient.del(`password-reset:${payload.userId}`);

  // Get the actual band name from theme
  const theme = await ThemeService.getTheme();
  const bandName = theme.siteTitle || config.appName;

  // Send success notification email
  await EmailService.sendPasswordResetSuccess(user.adminEmail, bandName);

  logger.info(`🔑 Password successfully reset for user ${uuid}`);
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
