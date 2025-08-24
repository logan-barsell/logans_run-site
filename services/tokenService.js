const jwt = require('jsonwebtoken');
const { generateHMACSignature } = require('../utils/hash');
const { AppError } = require('../middleware/errorHandler');
const redisClient = require('../utils/redisClient');
const logger = require('../utils/logger');
const { daysToSeconds } = require('../utils/dates');
const UserService = require('./userService');
const { setAuthCookies } = require('../utils/cookie-utils');
const { getClientIp } = require('../utils/request-utils');

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET;

// Generate Access Token (1 hour expiry)
function generateAccessToken(token) {
  try {
    const { id, uuid, role, userType } = token;
    return jwt.sign({ id, uuid, role, userType }, ACCESS_TOKEN_SECRET, {
      expiresIn: '1h',
    });
  } catch (error) {
    throw new AppError('Error generating access token', 500);
  }
}

// Generate Refresh Token (7 days expiry) & Store in Redis
async function generateRefreshToken(token, ip, userAgent) {
  try {
    const { id, uuid, role, userType } = token;
    const refreshToken = jwt.sign(
      { id, uuid, role, userType },
      REFRESH_TOKEN_SECRET,
      {
        expiresIn: '7d',
      }
    );
    await redisClient.set(
      `refreshToken:${id}`,
      JSON.stringify({
        token: refreshToken,
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
async function verifyRefreshToken(token, ip, userAgent) {
  const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
  const storedData = await redisClient.get(`refreshToken:${decoded.id}`);

  if (!storedData) throw new AppError('Refresh token not found', 401);

  const {
    token: storedToken,
    ip: storedIp,
    userAgent: storedUserAgent,
  } = JSON.parse(storedData);

  if (storedToken !== token) {
    logger.warn(
      `🚨 Refresh token reuse detected for user ${decoded.uuid} from IP: ${ip}`
    );
    // TODO: Implement Email or Slack alerts
    await UserService.endAllUserSessions(decoded.id, true); // Revoke all tokens and end sessions
    throw new AppError('Suspicious activity detected - Token reuse', 403);
  }

  if (storedIp !== ip || storedUserAgent !== userAgent) {
    logger.warn(
      `⚠️ Possible token theft for user ${decoded.uuid} - Different IP/device detected`
    );
    // TODO: Implement Email or Slack alerts
    await UserService.endAllUserSessions(decoded.id, true); // Revoke all tokens and end sessions
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

  const decoded = await verifyRefreshToken(oldRefreshToken, ip, userAgent);

  const newAccessToken = generateAccessToken(decoded);
  const newRefreshToken = await generateRefreshToken(decoded, ip, userAgent);

  setAuthCookies(res, newAccessToken, newRefreshToken);

  logger.info(`✅ New tokens issued for user ${decoded.id}`);
  return { userId: decoded.id, accessToken: newAccessToken };
}

// Revoke All Refresh Tokens for a User
async function revokeRefreshTokens(userId) {
  await redisClient.del(`refreshToken:${userId}`);
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
  generateSignedToken,
  verifySignedToken,
};

module.exports = TokenService;
