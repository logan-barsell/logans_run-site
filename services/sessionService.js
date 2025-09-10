const logger = require('../utils/logger');
const { withTenant } = require('../db/withTenant');

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
async function createSession(tenantId, userId, sessionData) {
  return await withTenant(tenantId, async tx => {
    const session = await tx.session.create({
      data: {
        tenantId,
        userId,
        sessionId: `session_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        ipAddress: sessionData.ipAddress,
        userAgent: sessionData.userAgent,
        expiresAt: sessionData.expiresAt,
      },
    });
    return session;
  });
}

/**
 * Retrieves paginated active sessions for a user.
 * @param {string} userId - The ID of the user.
 * @param {number} page - The page number (1-indexed).
 * @param {number} limit - The number of sessions per page.
 * @returns {Object} An object with sessions and the total count.
 */
async function getSessions(tenantId, userId, page, limit) {
  const skip = (page - 1) * limit;
  return await withTenant(tenantId, async tx => {
    const where = { tenantId, userId, isActive: true };
    const [sessions, count] = await Promise.all([
      tx.session.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
      }),
      tx.session.count({ where }),
    ]);
    return { sessions, count };
  });
}

/**
 * Ends a specific session for a user.
 * @param {string} sessionId - The ID of the session to end.
 * @param {string} userId - The ID of the user.
 * @returns {Object|null} The ended session or null if not found.
 */
async function endSession(tenantId, sessionId, userId) {
  return await withTenant(tenantId, async tx => {
    const session = await tx.session.findFirst({
      where: { tenantId, sessionId, userId, isActive: true },
    });
    if (!session) return null;
    const now = new Date();
    const logoutTime = session.expiresAt < now ? session.expiresAt : now;
    await tx.session.update({
      where: { id: session.id },
      data: { logoutTime, isActive: false },
    });
    return session;
  });
}

/**
 * Ends all other sessions for a user (excluding the current one).
 * @param {string} userId - The ID of the user.
 * @param {string} currentSessionId - The ID of the current session to keep.
 * @returns {number} The count of sessions ended.
 */
async function endAllOtherSessions(tenantId, userId, currentSessionId) {
  return await withTenant(tenantId, async tx => {
    const sessions = await tx.session.findMany({
      where: {
        tenantId,
        userId,
        isActive: true,
        NOT: { sessionId: currentSessionId },
      },
    });
    const now = new Date();
    for (const session of sessions) {
      const logoutTime = session.expiresAt < now ? session.expiresAt : now;
      await tx.session.update({
        where: { id: session.id },
        data: { logoutTime, isActive: false },
      });
    }
    return sessions.length;
  });
}

/**
 * Update an existing session.
 * @param {string} sessionId - The ID of the session to update.
 * @param {Object} updateData - Data to update in the session.
 * @returns {Object|null} The updated session or null if not found.
 */
async function updateSession(tenantId, sessionId, updateData) {
  try {
    return await withTenant(tenantId, async tx => {
      const existing = await tx.session.findFirst({
        where: { tenantId, sessionId, isActive: true },
      });
      if (!existing) return null;
      const session = await tx.session.update({
        where: { id: existing.id },
        data: { ...updateData, updatedAt: new Date() },
      });
      return session;
    });
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
async function getCurrentSession(tenantId, sessionId, userId) {
  try {
    return await withTenant(tenantId, async tx =>
      tx.session.findFirst({
        where: { tenantId, sessionId, userId, isActive: true },
      })
    );
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
