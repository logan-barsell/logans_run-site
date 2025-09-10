const jwt = require('jsonwebtoken');
const { generateHMACSignature } = require('../utils/hash');
const { AppError } = require('../middleware/errorHandler');
const redisClient = require('../utils/redisClient');
const logger = require('../utils/logger');
const { daysToSeconds } = require('../utils/dates');
const UserService = require('./userService');
const SessionService = require('./sessionService');
const { setAuthCookies } = require('../utils/cookie-utils');
const { getClientIp } = require('../utils/request-utils');
const BandsyteEmailService = require('./bandsyteEmailService');
const ThemeService = require('./themeService');
const { withTenant } = require('../db/withTenant');

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET;

// Generate Access Token (1 hour expiry)
function generateAccessToken(token) {
  try {
    const { id, uuid, sessionId } = token;
    return jwt.sign({ id, uuid, sessionId }, ACCESS_TOKEN_SECRET, {
      expiresIn: '1h',
    });
  } catch (error) {
    throw new AppError('Error generating access token', 500);
  }
}

// Generate Refresh Token (7 days expiry) & Store in Redis
async function generateRefreshToken(token, ip, userAgent) {
  try {
    const { id, uuid, sessionId } = token;
    const refreshToken = jwt.sign(
      { id, uuid, sessionId },
      REFRESH_TOKEN_SECRET,
      {
        expiresIn: '7d',
      }
    );
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

  if (!storedData) throw new AppError('Refresh token not found', 401);

  const {
    token: storedToken,
    userId,
    ip: storedIp,
    userAgent: storedUserAgent,
  } = JSON.parse(storedData);

  if (storedToken !== token) {
    logger.warn(
      `🚨 Refresh token reuse detected for user ${decoded.uuid} from IP: ${ip}`
    );

    // Send security alert email to user about suspicious activity
    try {
      const user = await UserService.findUserById(tenantId, userId);
      if (user && user.adminEmail) {
        const theme = await ThemeService.getTheme(tenantId);
        const bandName = theme.siteTitle || 'Bandsyte';

        await BandsyteEmailService.sendSecurityAlertWithBranding(
          user.adminEmail,
          bandName,
          'token_reuse',
          ip,
          userAgent,
          'Unknown'
        );
        logger.info(`📧 Security alert sent to user ${userId} for token reuse`);
      }
    } catch (emailError) {
      logger.error(
        'Failed to send security alert for token reuse:',
        emailError
      );
      // Don't fail the security check if email fails
    }

    await UserService.endAllUserSessions(tenantId, userId); // Revoke all tokens and end sessions
    throw new AppError('Suspicious activity detected - Token reuse', 403);
  }

  if (storedIp !== ip || storedUserAgent !== userAgent) {
    logger.warn(
      `⚠️ Possible token theft for user ${decoded.uuid} - Different IP/device detected`
    );

    // Send security alert email to user about device change
    try {
      const user = await UserService.findUserById(tenantId, decoded.id);
      if (user && user.adminEmail) {
        const theme = await ThemeService.getTheme(tenantId);
        const bandName = theme.siteTitle || 'Bandsyte';

        await BandsyteEmailService.sendSecurityAlertWithBranding(
          user.adminEmail,
          bandName,
          'device_change',
          ip,
          userAgent,
          'Unknown'
        );
        logger.info(
          `📧 Security alert sent to user ${decoded.id} for device change`
        );
      }
    } catch (emailError) {
      logger.error(
        'Failed to send security alert for device change:',
        emailError
      );
      // Don't fail the security check if email fails
    }

    await UserService.endAllUserSessions(tenantId, decoded.id); // Revoke all tokens and end sessions
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

  setAuthCookies(res, newAccessToken, newRefreshToken);

  logger.info(
    `✅ New tokens issued for user ${decoded.id}, session ${decoded.sessionId}`
  );
  return { userId: decoded.id, accessToken: newAccessToken };
}

// Revoke Refresh Token for a Specific Session
async function revokeSessionRefreshToken(sessionId) {
  await redisClient.del(`refreshToken:${sessionId}`);
}

// Revoke All Refresh Tokens for a User (for "End All Sessions")
async function revokeRefreshTokens(tenantId, userId) {
  await withTenant(tenantId, async tx => {
    const sessions = await tx.session.findMany({
      where: { tenantId, userId, isActive: true },
      select: { sessionId: true },
    });
    for (const { sessionId } of sessions) {
      await redisClient.del(`refreshToken:${sessionId}`);
    }
  });
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
  revokeRefreshTokens,
  revokeSessionRefreshToken,
  generateSignedToken,
  verifySignedToken,
};

module.exports = TokenService;
