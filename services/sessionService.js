const Session = require('../models/Session');

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

const SessionService = {
  createSession,
  endAllSessions,
  getSessions,
};

module.exports = SessionService;
