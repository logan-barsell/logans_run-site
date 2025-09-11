const { withTenant } = require('../db/withTenant');
const { prisma } = require('../db/prisma');
const ThemeService = require('./themeService');
const BandEmailService = require('./bandEmailService');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');
const { whitelistFields } = require('../utils/fieldWhitelist');

// Allowed preference fields
const PREFERENCE_FIELDS = [
  'receiveAutomaticNotifications',
  'notifyOnNewMusic',
  'notifyOnNewVideos',
  'notifyOnNewShows',
];

/**
 * Newsletter Service
 * Handles all newsletter-related operations
 */

/**
 * Add a new newsletter subscriber
 */
async function addSubscriber(tenantId, email, signupSource = 'website') {
  try {
    logger.info(
      `📧 Attempting to add subscriber: ${email} from source: ${signupSource}`
    );

    const normalized = email.toLowerCase();

    // Check if subscriber already exists (scoped to tenant)
    const existingSubscriber = await withTenant(tenantId, async tx =>
      tx.newsletterSubscriber.findUnique({
        where: { tenantId_email: { tenantId, email: normalized } },
      })
    );

    if (existingSubscriber) {
      logger.info(
        `📧 Existing subscriber found: ${email}, isActive: ${existingSubscriber.isActive}`
      );

      if (existingSubscriber.isActive) {
        logger.info(`📧 Subscriber ${email} is already active, throwing error`);
        throw new AppError(
          'Email is already subscribed to the newsletter',
          400
        );
      } else {
        // Reactivate existing subscriber
        logger.info(`📧 Reactivating existing subscriber: ${email}`);
        const reactivated = await withTenant(tenantId, async tx =>
          tx.newsletterSubscriber.update({
            where: { tenantId_email: { tenantId, email: normalized } },
            data: {
              isActive: true,
              unsubscribedAt: null,
              signupSource,
            },
          })
        );
        logger.info(`📧 Successfully reactivated subscriber: ${email}`);
        return reactivated;
      }
    }

    // Create new subscriber
    logger.info(`📧 Creating new subscriber: ${email}`);
    const subscriber = await withTenant(tenantId, async tx =>
      tx.newsletterSubscriber.create({
        data: {
          tenantId,
          email: normalized,
          signupSource,
        },
      })
    );
    logger.info(
      `📧 Successfully created new subscriber: ${email} with token: ${subscriber.unsubscribeToken}`
    );

    return subscriber;
  } catch (error) {
    logger.error(`❌ Error adding newsletter subscriber ${email}:`, error);
    throw new AppError(
      error.message || 'Error adding newsletter subscriber',
      error.statusCode || 500
    );
  }
}

/**
 * Get all active subscribers with pagination
 */
async function getActiveSubscribers(tenantId, page = 1, limit = 20) {
  try {
    const skip = (page - 1) * limit;

    const where = { tenantId, isActive: true };
    const [subscribers, total] = await withTenant(tenantId, async tx => {
      const list = await tx.newsletterSubscriber.findMany({
        where,
        orderBy: { subscribedAt: 'desc' },
        skip,
        take: limit,
      });
      const count = await tx.newsletterSubscriber.count({ where });
      return [list, count];
    });

    return {
      subscribers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalSubscribers: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  } catch (error) {
    logger.error('❌ Error getting active subscribers:', error);
    throw new AppError(
      error.message || 'Error getting active subscribers',
      error.statusCode || 500
    );
  }
}

/**
 * Get subscribers for specific notification type
 */
async function getSubscribersForNotification(tenantId, notificationType) {
  try {
    // Build the where clause for JSON preferences
    const whereClause = {
      tenantId,
      isActive: true,
      preferences: {
        path: ['receiveAutomaticNotifications'],
        equals: true,
      },
    };

    // Add notification type specific filter
    if (notificationType === 'show') {
      whereClause.preferences = {
        path: ['notifyOnNewShows'],
        equals: true,
      };
    } else if (notificationType === 'music') {
      whereClause.preferences = {
        path: ['notifyOnNewMusic'],
        equals: true,
      };
    } else if (notificationType === 'video') {
      whereClause.preferences = {
        path: ['notifyOnNewVideos'],
        equals: true,
      };
    }

    const subscribers = await withTenant(tenantId, async tx =>
      tx.newsletterSubscriber.findMany({
        where: whereClause,
      })
    );

    return subscribers;
  } catch (error) {
    logger.error(
      `❌ Error getting subscribers for ${notificationType} notifications:`,
      error
    );
    throw new AppError(
      error.message ||
        `Error getting subscribers for ${notificationType} notifications`,
      error.statusCode || 500
    );
  }
}

/**
 * Send notification emails for new content
 */
async function sendContentNotification(tenantId, contentType, content) {
  try {
    // Check if newsletter notifications are enabled
    const theme = await ThemeService.getTheme(tenantId);
    if (!theme || !theme.enableNewsletter) {
      logger.info('📧 Newsletter notifications disabled, skipping email');
      return {
        success: false,
        message: 'Newsletter notifications are disabled',
      };
    }

    // Check if this specific notification type is enabled
    let notificationField;
    switch (contentType) {
      case 'music':
        notificationField = 'notifyOnNewMusic';
        break;
      case 'video':
        notificationField = 'notifyOnNewVideos';
        break;
      case 'show':
        notificationField = 'notifyOnNewShows';
        break;
      default:
        notificationField = `notifyOnNew${
          contentType.charAt(0).toUpperCase() + contentType.slice(1)
        }`;
    }

    if (!theme[notificationField]) {
      logger.info(`📧 ${contentType} notifications disabled, skipping email`, {
        notificationField,
        themeValue: theme[notificationField],
        allThemeFields: {
          notifyOnNewMusic: theme.notifyOnNewMusic,
          notifyOnNewVideos: theme.notifyOnNewVideos,
          notifyOnNewShows: theme.notifyOnNewShows,
        },
      });
      return {
        success: false,
        message: `${contentType} notifications are disabled`,
      };
    }

    // Get subscribers for this notification type
    const subscribers = await getSubscribersForNotification(
      tenantId,
      contentType
    );

    if (subscribers.length === 0) {
      logger.info(`📧 No subscribers for ${contentType} notifications`);
      return { success: true, message: 'No subscribers to notify' };
    }

    const bandName = theme.siteTitle || 'Bandsyte';
    let emailsSent = 0;
    let errors = 0;

    let emailPromises;
    let results;

    if (process.env.NODE_ENV !== 'production') {
      // Development mode: Send only ONE test email
      logger.info(
        `🧪 DEV MODE: Sending single test email for ${contentType} notification to loganjbars@gmail.com (instead of ${subscribers.length} subscriber emails)`
      );

      try {
        // Send single test email using the proper content notification flow
        await BandEmailService.sendContentNotificationWithBranding(
          'loganjbars@gmail.com',
          bandName,
          contentType,
          content,
          'test-token-123',
          tenantId
        );

        results = [
          {
            status: 'fulfilled',
            value: { success: true, email: 'loganjbars@gmail.com' },
          },
        ];
      } catch (error) {
        logger.error('❌ Failed to send development test email:', error);
        results = [
          {
            status: 'rejected',
            reason: {
              success: false,
              email: 'loganjbars@gmail.com',
              error: error.message,
            },
          },
        ];
      }
    } else {
      // Production mode: Send to all subscribers
      emailPromises = subscribers.map(async subscriber => {
        try {
          // Use the same content notification flow as development
          await BandEmailService.sendContentNotificationWithBranding(
            subscriber.email,
            bandName,
            contentType,
            content,
            subscriber.unsubscribeToken,
            tenantId
          );

          // Update last email sent timestamp
          await withTenant(tenantId, async tx =>
            tx.newsletterSubscriber.update({
              where: { id: subscriber.id },
              data: { lastEmailSent: new Date() },
            })
          );

          return { success: true, email: subscriber.email };
        } catch (error) {
          logger.error(
            `❌ Failed to queue notification to ${subscriber.email}:`,
            error
          );
          return {
            success: false,
            email: subscriber.email,
            error: error.message,
          };
        }
      });

      // Wait for all emails to be queued (not sent yet - throttler handles sending)
      results = await Promise.allSettled(emailPromises);
    }

    // Count successes and failures
    results.forEach(result => {
      if (result.status === 'fulfilled' && result.value.success) {
        emailsSent++;
      } else {
        errors++;
      }
    });

    logger.info(
      `📧 Content notification completed: ${emailsSent} sent, ${errors} failed`
    );
    return {
      success: true,
      message: `Notifications sent: ${emailsSent} successful, ${errors} failed`,
      emailsSent,
      errors,
    };
  } catch (error) {
    logger.error(`❌ Error sending ${contentType} notifications:`, error);
    throw new AppError(
      error.message || `Error sending ${contentType} notifications`,
      error.statusCode || 500
    );
  }
}

/**
 * Get subscriber by unsubscribe token
 */
async function getSubscriberByToken(token) {
  try {
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { unsubscribeToken: token },
    });

    if (!subscriber) {
      throw new AppError('Invalid unsubscribe token', 400);
    }

    return subscriber;
  } catch (error) {
    logger.error('❌ Error getting subscriber by token:', error);
    throw new AppError(
      error.message || 'Error getting subscriber by token',
      error.statusCode || 500
    );
  }
}

/**
 * Unsubscribe a subscriber
 */
async function unsubscribe(token) {
  try {
    const subscriber = await getSubscriberByToken(token);

    await withTenant(subscriber.tenantId, async tx =>
      tx.newsletterSubscriber.update({
        where: { unsubscribeToken: token },
        data: { isActive: false, unsubscribedAt: new Date() },
      })
    );

    logger.info(`📧 Subscriber unsubscribed: ${subscriber.email}`);
    return { success: true, message: 'Successfully unsubscribed' };
  } catch (error) {
    logger.error('❌ Error unsubscribing:', error);
    throw new AppError(
      error.message || 'Error unsubscribing',
      error.statusCode || 500
    );
  }
}

/**
 * Admin unsubscribe a subscriber by ID (for admin management)
 */
async function adminUnsubscribe(tenantId, subscriberId) {
  try {
    const subscriber = await withTenant(tenantId, async tx =>
      tx.newsletterSubscriber.findUnique({ where: { id: subscriberId } })
    );
    if (!subscriber) throw new AppError('Subscriber not found', 404);
    if (!subscriber.isActive)
      throw new AppError('Subscriber is already unsubscribed', 400);

    await withTenant(tenantId, async tx =>
      tx.newsletterSubscriber.update({
        where: { id: subscriberId },
        data: {
          isActive: false,
          unsubscribedAt: new Date(),
          unsubscribeReason: 'admin',
        },
      })
    );

    logger.info(`📧 Admin unsubscribed: ${subscriber.email}`);
    return { success: true, message: 'Subscriber unsubscribed successfully' };
  } catch (error) {
    logger.error('❌ Error admin unsubscribing:', error);
    throw new AppError(
      error.message || 'Error unsubscribing subscriber',
      error.statusCode || 500
    );
  }
}

/**
 * Update subscriber preferences
 */
async function updatePreferences(tenantId, email, preferences) {
  try {
    const normalized = email.toLowerCase();
    const allowed = whitelistFields(preferences, PREFERENCE_FIELDS);
    const existing = await withTenant(tenantId, async tx =>
      tx.newsletterSubscriber.findUnique({
        where: { tenantId_email: { tenantId, email: normalized } },
      })
    );
    if (!existing) throw new AppError('Subscriber not found', 404);

    const merged = { ...(existing.preferences || {}), ...allowed };
    await withTenant(tenantId, async tx =>
      tx.newsletterSubscriber.update({
        where: { tenantId_email: { tenantId, email: normalized } },
        data: { preferences: merged },
      })
    );

    logger.info(`📧 Preferences updated for: ${email}`);
    return { success: true, message: 'Preferences updated successfully' };
  } catch (error) {
    logger.error('❌ Error updating preferences:', error);
    throw new AppError(
      error.message || 'Error updating preferences',
      error.statusCode || 500
    );
  }
}

/**
 * Get subscriber statistics
 */
async function getStats(tenantId) {
  try {
    const [totalSubscribers, activeSubscribers, recentSubscribers] =
      await withTenant(tenantId, async tx => {
        const whereTenant = { tenantId };
        const total = await tx.newsletterSubscriber.count({
          where: whereTenant,
        });
        const active = await tx.newsletterSubscriber.count({
          where: { tenantId, isActive: true },
        });
        const recent = await tx.newsletterSubscriber.count({
          where: {
            tenantId,
            subscribedAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
        });
        return [total, active, recent];
      });

    return {
      total: totalSubscribers,
      active: activeSubscribers,
      recent: recentSubscribers,
    };
  } catch (error) {
    logger.error('❌ Error getting newsletter stats:', error);
    throw new AppError(
      error.message || 'Error getting newsletter stats',
      error.statusCode || 500
    );
  }
}

module.exports = {
  addSubscriber,
  getActiveSubscribers,
  getSubscribersForNotification,
  sendContentNotification,
  getSubscriberByToken,
  unsubscribe,
  adminUnsubscribe,
  updatePreferences,
  getStats,
};
