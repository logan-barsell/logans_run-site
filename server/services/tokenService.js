const jwt = require('jsonwebtoken');
const { generateHMACSignature } = require('../utils/hash');
const { AppError } = require('../middleware/errorHandler');
const redisClient = require('../utils/redisClient');
const logger = require('../utils/logger');
const { daysToSeconds } = require('../utils/dates');
const UserService = require('./userService');
const SessionService = require('./sessionService');
const { setAuthCookies } = require('../utils/cookie-utils');
const { getConfig } = require('../config/app');
const { getClientIp } = require('../utils/request-utils');
const BandsyteEmailService = require('./bandsyteEmailService');
const ThemeService = require('./themeService');
const { withTenant } = require('../db/withTenant');
const {
  sendSecurityAlertWithDeduplication,
} = require('../utils/securityAlertDeduplicator');

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET;

/**
 * Send security alert with deduplication
 * @param {string} tenantId - Tenant ID
 * @param {string} userId - User ID
 * @param {string} alertType - Type of security alert
 * @param {string} ip - IP address
 * @param {string} userAgent - User agent
 * @returns {Promise<boolean>} True if alert was sent, false if skipped
 */
async function sendSecurityAlertWithDeduplicationHelper(
  tenantId,
  userId,
  alertType,
  ip,
  userAgent
) {
  try {
    const user = await UserService.findUserById(tenantId, userId);
    if (!user || !user.adminEmail) {
      logger.warn(
        `No admin email found for user ${userId}, skipping security alert`
      );
      return false;
    }

    const theme = await ThemeService.getTheme(tenantId);
    const bandName = theme.siteTitle || 'Bandsyte';

    // Use the deduplication utility to send the alert
    const alertSent = await sendSecurityAlertWithDeduplication(
      BandsyteEmailService.sendSecurityAlertWithBranding,
      userId,
      alertType,
      ip,
      user.adminEmail,
      bandName,
      new Date().toISOString(),
      ip,
      userAgent || 'Unknown',
      'Unknown Location',
      tenantId
    );

    if (alertSent) {
      logger.info(`📧 Security alert sent to user ${userId} for ${alertType}`);
    }

    return alertSent;
  } catch (error) {
    logger.error(`Failed to send security alert for ${alertType}:`, error);
    // Don't fail the security check if email fails
    return false;
  }
}

// Generate Access Token (1 hour expiry)
function generateAccessToken(token) {
  try {
    const { id, sessionId } = token;
    return jwt.sign({ id, sessionId }, ACCESS_TOKEN_SECRET, {
      expiresIn: '1h',
    });
  } catch (error) {
    throw new AppError('Error generating access token', 500);
  }
}

// Generate Refresh Token (7 days expiry) & Store in Redis
async function generateRefreshToken(token, ip, userAgent) {
  try {
    const { id, sessionId } = token;
    const refreshToken = jwt.sign({ id, sessionId }, REFRESH_TOKEN_SECRET, {
      expiresIn: '7d',
    });
    await redisClient.set(
      `refreshToken:${sessionId}`,
      JSON.stringify({
        token: refreshToken,
        userId: id,
        ip,
        userAgent,
      }),
      {
        EX: daysToSeconds(7), // Set expiration to 7 days
      }
    );
    return refreshToken;
  } catch (error) {
    throw new AppError('Error generating refresh token', 500);
  }
}

// Verify Access Token
function verifyAccessToken(token) {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch (error) {
    throw new AppError('Error verifying access token', 500);
  }
}

// Verify Refresh Token & Ensure It Matches Stored Token
async function verifyRefreshToken(token, ip, userAgent, tenantId) {
  const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
  const storedData = await redisClient.get(`refreshToken:${decoded.sessionId}`);

  if (!storedData) {
    // Token not found in Redis - likely due to server restart
    // Check if the token is still valid by verifying the JWT signature
    // and checking if the session exists in the database
    logger.warn(
      `Refresh token not found in Redis for session ${decoded.sessionId} - likely server restart`
    );
    throw new AppError('Refresh token expired or invalid', 401);
  }

  const {
    token: storedToken,
    userId,
    ip: storedIp,
    userAgent: storedUserAgent,
  } = JSON.parse(storedData);

  if (storedToken !== token) {
    logger.warn(
      `🚨 Refresh token reuse detected for user ${decoded.id} from IP: ${ip}`
    );

    // Send security alert email to user about suspicious activity with deduplication
    await sendSecurityAlertWithDeduplicationHelper(
      tenantId,
      userId,
      'token_reuse',
      ip,
      userAgent
    );

    await endAllUserSessions(tenantId, userId); // Revoke all tokens and end sessions
    throw new AppError('Suspicious activity detected - Token reuse', 403);
  }

  if (storedIp !== ip || storedUserAgent !== userAgent) {
    logger.warn(
      `⚠️ Possible token theft for user ${decoded.id} - Different IP/device detected`
    );

    // Send security alert email to user about device change with deduplication
    await sendSecurityAlertWithDeduplicationHelper(
      tenantId,
      userId,
      'device_change',
      ip,
      userAgent
    );

    await endAllUserSessions(tenantId, userId); // Revoke all tokens and end sessions
    throw new AppError(
      'Suspicious activity detected - Token used from a different device',
      403
    );
  }

  return decoded;
}

// Refresh access token from cookies
async function refreshAccessToken(req, res) {
  const ip = getClientIp(req);
  const userAgent = req.headers['user-agent'] || 'unknown';
  const oldRefreshToken = req.cookies.refresh_token;

  if (!oldRefreshToken) {
    logger.warn(`⚠️ Refresh token missing - IP: ${ip}`);
    throw new AppError('Refresh token required', 401);
  }

  const decoded = await verifyRefreshToken(
    oldRefreshToken,
    ip,
    userAgent,
    req.tenantId
  );

  // Update existing session instead of creating new one
  await SessionService.updateSession(req.tenantId, decoded.sessionId, {
    updatedAt: new Date(),
  });

  const newAccessToken = generateAccessToken(decoded);
  const newRefreshToken = await generateRefreshToken(decoded, ip, userAgent);

  const config = await getConfig(req.tenantId);
  setAuthCookies(res, newAccessToken, newRefreshToken, config.domain);

  logger.info(
    `✅ New tokens issued for user ${decoded.id}, session ${decoded.sessionId}`
  );
  return { userId: decoded.id, accessToken: newAccessToken };
}

// Revoke Refresh Token for a Specific Session
async function revokeSessionRefreshToken(sessionId) {
  await redisClient.del(`refreshToken:${sessionId}`);
}

// End all user sessions (moved from userService to break circular dependency)
async function endAllUserSessions(tenantId, userId) {
  try {
    await withTenant(tenantId, async tx => {
      const logoutTime = new Date();

      // Update all active sessions to inactive
      await tx.session.updateMany({
        where: { tenantId, userId, isActive: true },
        data: { logoutTime, isActive: false },
      });
    });

    // Revoke all refresh tokens for this user
    await withTenant(tenantId, async tx => {
      const sessions = await tx.session.findMany({
        where: { tenantId, userId, isActive: true },
        select: { sessionId: true },
      });
      for (const { sessionId } of sessions) {
        await redisClient.del(`refreshToken:${sessionId}`);
      }
    });
  } catch (error) {
    logger.error('Error ending all user sessions:', error);
    throw error;
  }
}

function generateSignedToken(payload) {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64');
  const signature = generateHMACSignature(data);

  return `${data}.${signature}`;
}

function verifySignedToken(token) {
  const [data, signature] = token.split('.');

  // Verify signature
  const expectedSignature = generateHMACSignature(data);

  // Check for signature mismatch
  if (signature !== expectedSignature) {
    return null;
  }

  // Decode payload
  const payload = JSON.parse(Buffer.from(data, 'base64').toString());

  // Check for expired Token
  if (new Date(payload.expiresAt) < new Date()) {
    return null;
  }

  return payload;
}

const TokenService = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  refreshAccessToken,
  revokeSessionRefreshToken,
  endAllUserSessions,
  generateSignedToken,
  verifySignedToken,
};

module.exports = TokenService;
