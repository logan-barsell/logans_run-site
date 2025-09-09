const NewsletterService = require('../services/newsletterService');
const BandEmailService = require('../services/bandEmailService');
const BandsyteEmailService = require('../services/bandsyteEmailService');
const ThemeService = require('../services/themeService');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * Newsletter signup
 */
async function newsletterSignup(req, res, next) {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      throw new AppError('Email is required', 400);
    }

    // Add subscriber to database
    const subscriber = await NewsletterService.addSubscriber(email, 'website');

    // Get the actual band name from theme
    const theme = await ThemeService.getTheme();
    const bandName = theme.siteTitle || 'Bandsyte';

    // Send newsletter confirmation email to fan using band email service
    await BandEmailService.sendNewsletterConfirmationWithBranding(
      email, // subscriber email (used for both sending and display)
      bandName, // band name
      subscriber.unsubscribeToken // unsubscribe token
    );

    // Send notification email to band admin
    await BandsyteEmailService.sendNewsletterSignupNotificationWithBranding(
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
      throw new AppError('Unsubscribe token is required', 400);
    }

    // Verify the token exists
    const subscriber = await NewsletterService.getSubscriberByToken(token);

    // Success - return subscriber info for frontend processing
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
      throw new AppError('Unsubscribe token is required', 400);
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

/**
 * Admin unsubscribe a subscriber (admin only)
 */
async function adminUnsubscribeSubscriber(req, res, next) {
  try {
    const { subscriberId } = req.params;

    if (!subscriberId) {
      throw new AppError('Subscriber ID is required', 400);
    }

    await NewsletterService.adminUnsubscribe(subscriberId);

    res.status(200).json({
      success: true,
      message: 'Subscriber unsubscribed successfully',
    });
  } catch (error) {
    logger.error('❌ Failed to unsubscribe subscriber:', error);
    next(error);
  }
}

module.exports = {
  newsletterSignup,
  verifyUnsubscribeToken,
  unsubscribe,
  getNewsletterStats,
  getNewsletterSubscribers,
  adminUnsubscribeSubscriber,
};
