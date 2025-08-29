const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const Theme = require('../models/Theme');
const { sendEmail } = require('./emailService');
const newsletterNotification = require('../templates/newsletterNotification');
const logger = require('../utils/logger');

/**
 * Newsletter Service
 * Handles all newsletter-related operations
 */

class NewsletterService {
  /**
   * Add a new newsletter subscriber
   */
  static async addSubscriber(email, signupSource = 'website') {
    try {
      // Check if subscriber already exists
      const existingSubscriber = await NewsletterSubscriber.findOne({
        email: email.toLowerCase(),
      });

      if (existingSubscriber) {
        if (existingSubscriber.isActive) {
          return {
            success: false,
            message: 'Email is already subscribed to the newsletter',
          };
        } else {
          // Reactivate existing subscriber
          existingSubscriber.isActive = true;
          existingSubscriber.unsubscribedAt = null;
          existingSubscriber.signupSource = signupSource;
          await existingSubscriber.save();
          return {
            success: true,
            message: 'Newsletter subscription reactivated',
          };
        }
      }

      // Create new subscriber
      const subscriber = new NewsletterSubscriber({
        email: email.toLowerCase(),
        signupSource,
      });

      await subscriber.save();

      logger.info(`📧 New newsletter subscriber added: ${email}`);
      return {
        success: true,
        message: 'Successfully subscribed to newsletter',
      };
    } catch (error) {
      logger.error('❌ Error adding newsletter subscriber:', error);
      throw error;
    }
  }

  /**
   * Get all active subscribers with pagination
   */
  static async getActiveSubscribers(page = 1, limit = 20) {
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
      throw error;
    }
  }

  /**
   * Get subscribers for specific notification type
   */
  static async getSubscribersForNotification(notificationType) {
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
      throw error;
    }
  }

  /**
   * Send notification emails for new content
   */
  static async sendContentNotification(contentType, content) {
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
      const subscribers = await this.getSubscribersForNotification(contentType);

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

          await sendEmail({
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
      throw error;
    }
  }

  /**
   * Unsubscribe a subscriber
   */
  static async unsubscribe(token) {
    try {
      const subscriber = await NewsletterSubscriber.findOne({
        unsubscribeToken: token,
      });

      if (!subscriber) {
        return { success: false, message: 'Invalid unsubscribe token' };
      }

      subscriber.isActive = false;
      subscriber.unsubscribedAt = new Date();
      await subscriber.save();

      logger.info(`📧 Subscriber unsubscribed: ${subscriber.email}`);
      return { success: true, message: 'Successfully unsubscribed' };
    } catch (error) {
      logger.error('❌ Error unsubscribing:', error);
      throw error;
    }
  }

  /**
   * Update subscriber preferences
   */
  static async updatePreferences(email, preferences) {
    try {
      const subscriber = await NewsletterSubscriber.findOne({
        email: email.toLowerCase(),
      });

      if (!subscriber) {
        return { success: false, message: 'Subscriber not found' };
      }

      subscriber.preferences = { ...subscriber.preferences, ...preferences };
      await subscriber.save();

      logger.info(`📧 Preferences updated for: ${email}`);
      return { success: true, message: 'Preferences updated successfully' };
    } catch (error) {
      logger.error('❌ Error updating preferences:', error);
      throw error;
    }
  }

  /**
   * Get subscriber statistics
   */
  static async getStats() {
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
      throw error;
    }
  }
}

module.exports = NewsletterService;
