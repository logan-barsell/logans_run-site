const Session = require('../models/Session');
const logger = require('../utils/logger');

const baseFields = {
  sessionId: true,
  userId: true,
  loginTime: true,
  logoutTime: true,
  expiresAt: true,
  isActive: true,
  ipAddress: true,
  userAgent: true,
};

/**
 * Creates a new session for a user.
 * @param {string} userId - The ID of the user.
 * @param {Object} sessionData - Additional session data such as ipAddress and userAgent.
 * @returns {Object} The created session.
 */
async function createSession(userId, sessionData) {
  const session = new Session({
    userId,
    sessionId: `session_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`,
    ipAddress: sessionData.ipAddress,
    userAgent: sessionData.userAgent,
    expiresAt: sessionData.expiresAt,
  });

  await session.save();
  return session;
}

/**
 * Ends all active sessions for a user.
 * @param {string} userId - The ID of the user.
 * @returns {number} The count of sessions updated.
 */
async function endAllSessions(userId) {
  const sessions = await Session.find({ userId, isActive: true });

  for (const session of sessions) {
    const now = new Date();
    const logoutTime = session.expiresAt < now ? session.expiresAt : now;
    await Session.findByIdAndUpdate(session._id, {
      logoutTime,
      isActive: false,
    });
  }

  return sessions.length;
}

/**
 * Retrieves paginated sessions for a user.
 * @param {string} userId - The ID of the user.
 * @param {number} page - The page number (1-indexed).
 * @param {number} limit - The number of sessions per page.
 * @returns {Object} An object with sessions and the total count.
 */
async function getSessions(userId, page, limit) {
  const skip = (page - 1) * limit;

  const [sessions, count] = await Promise.all([
    Session.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select(baseFields),
    Session.countDocuments({ userId }),
  ]);

  return { sessions, count };
}

/**
 * Ends a specific session for a user.
 * @param {string} sessionId - The ID of the session to end.
 * @param {string} userId - The ID of the user.
 * @returns {Object|null} The ended session or null if not found.
 */
async function endSession(sessionId, userId) {
  const session = await Session.findOne({ sessionId, userId, isActive: true });

  if (!session) {
    return null;
  }

  const now = new Date();
  const logoutTime = session.expiresAt < now ? session.expiresAt : now;

  await Session.findByIdAndUpdate(session._id, {
    logoutTime,
    isActive: false,
  });

  return session;
}

/**
 * Ends all other sessions for a user (excluding the current one).
 * @param {string} userId - The ID of the user.
 * @param {string} currentSessionId - The ID of the current session to keep.
 * @returns {number} The count of sessions ended.
 */
async function endAllOtherSessions(userId, currentSessionId) {
  const sessions = await Session.find({
    userId,
    isActive: true,
    sessionId: { $ne: currentSessionId },
  });

  for (const session of sessions) {
    const now = new Date();
    const logoutTime = session.expiresAt < now ? session.expiresAt : now;
    await Session.findByIdAndUpdate(session._id, {
      logoutTime,
      isActive: false,
    });
  }

  return sessions.length;
}

/**
 * Get the current active session for a user based on request context.
 * @param {string} userId - The ID of the user.
 * @param {Object} req - The request object containing IP and user agent.
 * @returns {Object|null} The current session or null if not found.
 */
async function getCurrentSession(userId, req) {
  try {
    const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    // Try to find session by IP and user agent first (most specific)
    let session = await Session.findOne({
      userId,
      isActive: true,
      ipAddress,
      userAgent,
    });

    // If not found, try to find any active session for this user
    if (!session) {
      session = await Session.findOne({
        userId,
        isActive: true,
      });
    }

    return session;
  } catch (error) {
    logger.error('Error getting current session:', error);
    return null;
  }
}

const SessionService = {
  createSession,
  endAllSessions,
  getSessions,
  endSession,
  endAllOtherSessions,
  getCurrentSession,
};

module.exports = SessionService;
