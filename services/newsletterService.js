const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const Theme = require('../models/Theme');
const EmailService = require('./emailService');
const newsletterNotification = require('../templates/newsletterNotification');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');

/**
 * Newsletter Service
 * Handles all newsletter-related operations
 */

/**
 * Add a new newsletter subscriber
 */
async function addSubscriber(email, signupSource = 'website') {
  try {
    logger.info(
      `📧 Attempting to add subscriber: ${email} from source: ${signupSource}`
    );

    // Check if subscriber already exists
    const existingSubscriber = await NewsletterSubscriber.findOne({
      email: email.toLowerCase(),
    });

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
        existingSubscriber.isActive = true;
        existingSubscriber.unsubscribedAt = null;
        existingSubscriber.signupSource = signupSource;
        await existingSubscriber.save();
        logger.info(`📧 Successfully reactivated subscriber: ${email}`);
        return existingSubscriber;
      }
    }

    // Create new subscriber
    logger.info(`📧 Creating new subscriber: ${email}`);
    const subscriber = new NewsletterSubscriber({
      email: email.toLowerCase(),
      signupSource,
    });

    await subscriber.save();
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
async function getActiveSubscribers(page = 1, limit = 20) {
  try {
    const skip = (page - 1) * limit;

    const subscribers = await NewsletterSubscriber.find({ isActive: true })
      .sort({ subscribedAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit);

    const total = await NewsletterSubscriber.countDocuments({
      isActive: true,
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
async function getSubscribersForNotification(notificationType) {
  try {
    const query = {
      isActive: true,
      'preferences.receiveAutomaticNotifications': true,
    };

    // Add specific notification preference
    switch (notificationType) {
      case 'show':
        query['preferences.notifyOnNewShows'] = true;
        break;
      case 'music':
        query['preferences.notifyOnNewMusic'] = true;
        break;
      case 'video':
        query['preferences.notifyOnNewVideos'] = true;
        break;
      default:
        break;
    }

    return await NewsletterSubscriber.find(query);
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
async function sendContentNotification(contentType, content) {
  try {
    // Check if newsletter notifications are enabled
    const theme = await Theme.findOne();
    if (!theme || !theme.enableNewsletter) {
      logger.info('📧 Newsletter notifications disabled, skipping email');
      return {
        success: false,
        message: 'Newsletter notifications are disabled',
      };
    }

    // Check if this specific notification type is enabled
    const notificationField = `notifyOnNew${
      contentType.charAt(0).toUpperCase() + contentType.slice(1)
    }s`;
    if (!theme[notificationField]) {
      logger.info(`📧 ${contentType} notifications disabled, skipping email`);
      return {
        success: false,
        message: `${contentType} notifications are disabled`,
      };
    }

    // Get subscribers for this notification type
    const subscribers = await getSubscribersForNotification(contentType);

    if (subscribers.length === 0) {
      logger.info(`📧 No subscribers for ${contentType} notifications`);
      return { success: true, message: 'No subscribers to notify' };
    }

    // Get theme colors for email styling
    const colors = {
      primary: theme.primaryColor,
      secondary: theme.secondaryColor,
    };

    const bandName = theme.siteTitle || 'Bandsyte';
    let emailsSent = 0;
    let errors = 0;

    // Send emails to each subscriber
    for (const subscriber of subscribers) {
      try {
        const emailTemplate = newsletterNotification(
          bandName,
          content,
          contentType,
          colors,
          subscriber.unsubscribeToken
        );

        await EmailService.sendEmail({
          to: subscriber.email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
        });

        // Update last email sent timestamp
        subscriber.lastEmailSent = new Date();
        await subscriber.save();

        emailsSent++;
        logger.info(
          `📧 Notification sent to ${subscriber.email} for ${contentType}`
        );
      } catch (error) {
        errors++;
        logger.error(
          `❌ Failed to send notification to ${subscriber.email}:`,
          error
        );
      }
    }

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
    const subscriber = await NewsletterSubscriber.findOne({
      unsubscribeToken: token,
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

    subscriber.isActive = false;
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

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
 * Update subscriber preferences
 */
async function updatePreferences(email, preferences) {
  try {
    const subscriber = await NewsletterSubscriber.findOne({
      email: email.toLowerCase(),
    });

    if (!subscriber) {
      throw new AppError('Subscriber not found', 404);
    }

    subscriber.preferences = { ...subscriber.preferences, ...preferences };
    await subscriber.save();

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
async function getStats() {
  try {
    const totalSubscribers = await NewsletterSubscriber.countDocuments();
    const activeSubscribers = await NewsletterSubscriber.countDocuments({
      isActive: true,
    });
    const recentSubscribers = await NewsletterSubscriber.countDocuments({
      subscribedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Last 30 days
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
  updatePreferences,
  getStats,
};
