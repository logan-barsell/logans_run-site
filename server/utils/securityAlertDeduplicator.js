const redisClient = require('./redisClient');
const logger = require('./logger');
const { hashValue } = require('./hash');

/**
 * Security Alert Deduplication Utility
 *
 * Prevents spam security alerts by tracking recent alerts and implementing
 * smart deduplication based on user, alert type, and IP address.
 */

// Configuration constants - can be overridden via environment variables
const DEDUPLICATION_WINDOW_MINUTES =
  parseInt(process.env.SECURITY_ALERT_DEDUP_WINDOW_MINUTES) || 5; // 5 minute deduplication window
const MAX_ALERTS_PER_USER_PER_HOUR =
  parseInt(process.env.SECURITY_ALERT_MAX_PER_HOUR) || 10; // Rate limit per user

/**
 * Generate a unique key for deduplication based on user, alert type, and IP
 * @param {string} userId - User ID
 * @param {string} alertType - Type of security alert
 * @param {string} ipAddress - IP address (hashed for privacy)
 * @returns {string} Redis key for deduplication
 */
function generateDeduplicationKey(userId, alertType, ipAddress) {
  const ipHash = hashValue(ipAddress);
  return `security_alert:${userId}:${alertType}:${ipHash}`;
}

/**
 * Generate a rate limiting key for user-based throttling
 * @param {string} userId - User ID
 * @returns {string} Redis key for rate limiting
 */
function generateRateLimitKey(userId) {
  return `security_alert_rate:${userId}`;
}

/**
 * Check if a security alert should be sent (not deduplicated or rate limited)
 * @param {string} userId - User ID
 * @param {string} alertType - Type of security alert
 * @param {string} ipAddress - IP address
 * @returns {Promise<boolean>} True if alert should be sent, false if should be skipped
 */
async function shouldSendSecurityAlert(userId, alertType, ipAddress) {
  try {
    // Check deduplication (same user + alert type + IP within time window)
    const dedupKey = generateDeduplicationKey(userId, alertType, ipAddress);
    const recentAlert = await redisClient.get(dedupKey);

    if (recentAlert) {
      logger.info(
        `📧 Skipping duplicate security alert for user ${userId} (${alertType})`
      );
      return false;
    }

    // Check rate limiting (max alerts per user per hour)
    const rateLimitKey = generateRateLimitKey(userId);
    const alertCount = await redisClient.incr(rateLimitKey);

    // Set expiration on first increment
    if (alertCount === 1) {
      await redisClient.expire(rateLimitKey, 3600); // 1 hour
    }

    if (alertCount > MAX_ALERTS_PER_USER_PER_HOUR) {
      logger.warn(
        `📧 Rate limiting security alerts for user ${userId} (${alertCount} alerts in last hour)`
      );
      return false;
    }

    return true;
  } catch (error) {
    logger.error('Error checking security alert deduplication:', error);
    // On error, allow the alert to be sent (fail open)
    return true;
  }
}

/**
 * Mark a security alert as sent to prevent duplicates
 * @param {string} userId - User ID
 * @param {string} alertType - Type of security alert
 * @param {string} ipAddress - IP address
 * @returns {Promise<void>}
 */
async function markSecurityAlertSent(userId, alertType, ipAddress) {
  try {
    const dedupKey = generateDeduplicationKey(userId, alertType, ipAddress);
    const windowSeconds = DEDUPLICATION_WINDOW_MINUTES * 60;

    await redisClient.set(dedupKey, 'sent', { EX: windowSeconds });

    logger.debug(
      `📧 Marked security alert as sent for user ${userId} (${alertType})`
    );
  } catch (error) {
    logger.error('Error marking security alert as sent:', error);
    // Don't throw - this is not critical enough to fail the alert sending
  }
}

/**
 * Atomically check and set deduplication key to prevent race conditions
 * @param {string} userId - User ID
 * @param {string} alertType - Type of security alert
 * @param {string} ipAddress - IP address
 * @returns {Promise<boolean>} True if alert should be sent (key was set), false if duplicate
 */
async function tryAtomicDeduplication(userId, alertType, ipAddress) {
  try {
    const dedupKey = generateDeduplicationKey(userId, alertType, ipAddress);
    const windowSeconds = DEDUPLICATION_WINDOW_MINUTES * 60;

    // Use SET with NX (only if not exists) and EX (expiration) for atomic operation
    // This prevents race conditions by combining check-and-set into one operation
    const result = await redisClient.set(dedupKey, 'sent', {
      NX: true, // Only set if key doesn't exist
      EX: windowSeconds, // Set expiration
    });

    if (result === 'OK') {
      // Key was successfully set, alert should be sent
      logger.debug(
        `📧 Atomic deduplication successful for user ${userId} (${alertType})`
      );
      return true;
    } else {
      // Key already exists, skip duplicate alert
      logger.info(
        `📧 Skipping duplicate security alert for user ${userId} (${alertType}) - atomic check`
      );
      return false;
    }
  } catch (error) {
    logger.error('Error in atomic deduplication check:', error);
    // On error, allow the alert to be sent (fail open)
    return true;
  }
}

/**
 * Send a security alert with deduplication
 * This is a wrapper that handles the deduplication logic
 * @param {Function} sendAlertFunction - Function that actually sends the alert
 * @param {string} userId - User ID
 * @param {string} alertType - Type of security alert
 * @param {string} ipAddress - IP address
 * @param {...any} alertArgs - Arguments to pass to the sendAlertFunction
 * @returns {Promise<boolean>} True if alert was sent, false if skipped
 */
async function sendSecurityAlertWithDeduplication(
  sendAlertFunction,
  userId,
  alertType,
  ipAddress,
  ...alertArgs
) {
  try {
    // Use atomic deduplication to prevent race conditions
    const shouldSend = await tryAtomicDeduplication(
      userId,
      alertType,
      ipAddress
    );

    if (!shouldSend) {
      return false; // Alert was skipped due to deduplication
    }

    // Check rate limiting (after atomic deduplication passes)
    const rateLimitKey = generateRateLimitKey(userId);
    const alertCount = await redisClient.incr(rateLimitKey);

    // Set expiration on first increment
    if (alertCount === 1) {
      await redisClient.expire(rateLimitKey, 3600); // 1 hour
    }

    if (alertCount > MAX_ALERTS_PER_USER_PER_HOUR) {
      logger.warn(
        `📧 Rate limiting security alerts for user ${userId} (${alertCount} alerts in last hour)`
      );
      return false; // Alert was skipped due to rate limiting
    }

    // Send the actual alert
    await sendAlertFunction(...alertArgs);

    logger.info(
      `📧 Security alert sent successfully for user ${userId} (${alertType})`
    );
    return true; // Alert was sent
  } catch (error) {
    logger.error(`Error sending security alert for user ${userId}:`, error);
    throw error; // Re-throw to let calling code handle the error
  }
}

/**
 * Clear all security alert deduplication data for a user (useful for testing)
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
async function clearUserSecurityAlertData(userId) {
  try {
    // Clear deduplication data
    const pattern = `security_alert:${userId}:*`;
    const keys = await redisClient.keys(pattern);

    if (keys.length > 0) {
      await redisClient.del(...keys);
      logger.info(
        `Cleared ${keys.length} security alert deduplication entries for user ${userId}`
      );
    }

    // Clear rate limiting data
    const rateLimitKey = generateRateLimitKey(userId);
    const rateLimitDeleted = await redisClient.del(rateLimitKey);
    if (rateLimitDeleted > 0) {
      logger.info(`Cleared rate limiting data for user ${userId}`);
    }
  } catch (error) {
    logger.error('Error clearing user security alert data:', error);
    throw error;
  }
}

module.exports = {
  shouldSendSecurityAlert,
  markSecurityAlertSent,
  tryAtomicDeduplication,
  sendSecurityAlertWithDeduplication,
  clearUserSecurityAlertData,
  // Export constants for testing/configuration
  DEDUPLICATION_WINDOW_MINUTES,
  MAX_ALERTS_PER_USER_PER_HOUR,
};
