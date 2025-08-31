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
 * Retrieves paginated active sessions for a user.
 * @param {string} userId - The ID of the user.
 * @param {number} page - The page number (1-indexed).
 * @param {number} limit - The number of sessions per page.
 * @returns {Object} An object with sessions and the total count.
 */
async function getSessions(userId, page, limit) {
  const skip = (page - 1) * limit;

  const [sessions, count] = await Promise.all([
    Session.find({ userId, isActive: true })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select(baseFields),
    Session.countDocuments({ userId, isActive: true }),
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
 * Update an existing session.
 * @param {string} sessionId - The ID of the session to update.
 * @param {Object} updateData - Data to update in the session.
 * @returns {Object|null} The updated session or null if not found.
 */
async function updateSession(sessionId, updateData) {
  try {
    const session = await Session.findOneAndUpdate(
      { sessionId, isActive: true },
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );
    return session;
  } catch (error) {
    logger.error('Error updating session:', error);
    return null;
  }
}

/**
 * Get the current active session for a user based on sessionId from token.
 * @param {string} sessionId - The ID of the session from JWT token.
 * @param {string} userId - The ID of the user for security validation.
 * @returns {Object|null} The current session or null if not found.
 */
async function getCurrentSession(sessionId, userId) {
  try {
    // Direct lookup by sessionId, validate userId for security
    const session = await Session.findOne({
      sessionId,
      userId,
      isActive: true,
    });

    return session;
  } catch (error) {
    logger.error('Error getting current session:', error);
    return null;
  }
}

const SessionService = {
  createSession,
  getSessions,
  endSession,
  endAllOtherSessions,
  updateSession,
  getCurrentSession,
};

module.exports = SessionService;
