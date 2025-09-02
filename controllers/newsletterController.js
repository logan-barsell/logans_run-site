const NewsletterService = require('../services/newsletterService');
const EmailService = require('../services/emailService');
const ThemeService = require('../services/themeService');
const logger = require('../utils/logger');

/**
 * Newsletter signup
 */
async function newsletterSignup(req, res, next) {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    // Add subscriber to database
    const subscriber = await NewsletterService.addSubscriber(email, 'website');

    // Get the actual band name from theme
    const theme = await ThemeService.getTheme();
    const bandName = theme.siteTitle || 'Bandsyte';

    // Send newsletter confirmation email to fan
    await EmailService.sendNewsletterConfirmation(
      email,
      email,
      bandName,
      subscriber.unsubscribeToken
    );

    // Send notification email to band admin
    await EmailService.sendNewsletterSignupNotification(
      process.env.ADMIN_EMAIL || 'admin@bandsyte.com',
      email,
      bandName
    );

    logger.info(`📧 Newsletter signup: ${email}`);

    res.status(200).json({
      success: true,
      message: 'Successfully subscribed to newsletter',
    });
  } catch (error) {
    logger.error('❌ Newsletter signup failed:', error);
    next(error);
  }
}

/**
 * Verify unsubscribe token
 */
async function verifyUnsubscribeToken(req, res, next) {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Unsubscribe token is required',
      });
    }

    // Verify the token exists
    const subscriber = await NewsletterService.getSubscriberByToken(token);

    // Return success with subscriber info for frontend processing
    res.status(200).json({
      success: true,
      message: 'Token verified',
      subscriber: {
        email: subscriber.email,
        unsubscribeToken: subscriber.unsubscribeToken,
      },
    });
  } catch (error) {
    logger.error('❌ Newsletter unsubscribe verification failed:', error);
    next(error);
  }
}

/**
 * Unsubscribe from newsletter
 */
async function unsubscribe(req, res, next) {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Unsubscribe token is required',
      });
    }

    await NewsletterService.unsubscribe(token);

    res.status(200).json({
      success: true,
      message: 'Successfully unsubscribed from newsletter',
    });
  } catch (error) {
    logger.error('❌ Newsletter unsubscribe failed:', error);
    next(error);
  }
}

/**
 * Get newsletter statistics (admin only)
 */
async function getNewsletterStats(req, res, next) {
  try {
    const stats = await NewsletterService.getStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    logger.error('❌ Failed to get newsletter stats:', error);
    next(error);
  }
}

/**
 * Get all newsletter subscribers (admin only)
 */
async function getNewsletterSubscribers(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const result = await NewsletterService.getActiveSubscribers(page, limit);

    res.status(200).json({
      success: true,
      data: result.subscribers,
      pagination: result.pagination,
    });
  } catch (error) {
    logger.error('❌ Failed to get newsletter subscribers:', error);
    next(error);
  }
}

module.exports = {
  newsletterSignup,
  verifyUnsubscribeToken,
  unsubscribe,
  getNewsletterStats,
  getNewsletterSubscribers,
};
