const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const {
  sendContactNotification,
  sendNewsletterConfirmation,
  sendNewsletterSignupNotification,
} = require('../services/emailService');
const themeService = require('../services/themeService');
const NewsletterService = require('../services/newsletterService');
const logger = require('../utils/logger');

// GET contact information
router.get('/getContactInfo', contactController.getContactInfo);

// POST contact form submission
router.post('/send-message', async (req, res) => {
  try {
    const { name, email, title, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required',
      });
    }

    // Get the actual band name from theme
    const theme = await themeService.getTheme();
    const bandName = theme.siteTitle || 'Bandsyte';

    // Send notification email to admin
    const contactData = { name, email, title, message };
    await sendContactNotification(
      process.env.ADMIN_EMAIL || 'admin@bandsyte.com',
      contactData,
      bandName
    );

    logger.info(
      `📧 Contact form submitted by ${name} (${email}) - Subject: ${
        title || 'No subject'
      }`
    );

    res.status(200).json({
      success: true,
      message: 'Message sent successfully',
    });
  } catch (error) {
    logger.error('❌ Contact form submission failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
    });
  }
});

// POST newsletter signup
router.post('/newsletter-signup', async (req, res) => {
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
    const result = await NewsletterService.addSubscriber(email, 'website');

    if (!result.success) {
      return res.status(400).json(result);
    }

    // Get the actual band name from theme
    const theme = await themeService.getTheme();
    const bandName = theme.siteTitle || 'Bandsyte';

    // Send newsletter confirmation email to fan
    await sendNewsletterConfirmation(email, email, bandName);

    // Send notification email to band admin
    await sendNewsletterSignupNotification(
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
    res.status(500).json({
      success: false,
      message: 'Failed to subscribe to newsletter',
    });
  }
});

// GET unsubscribe from newsletter
router.get('/unsubscribe', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Unsubscribe token is required',
      });
    }

    const result = await NewsletterService.unsubscribe(token);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json({
      success: true,
      message: 'Successfully unsubscribed from newsletter',
    });
  } catch (error) {
    logger.error('❌ Newsletter unsubscribe failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unsubscribe from newsletter',
    });
  }
});

// GET newsletter statistics (admin only)
router.get('/newsletter-stats', async (req, res) => {
  try {
    const stats = await NewsletterService.getStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    logger.error('❌ Failed to get newsletter stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get newsletter statistics',
    });
  }
});

// GET all newsletter subscribers (admin only)
router.get('/newsletter-subscribers', async (req, res) => {
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
    res.status(500).json({
      success: false,
      message: 'Failed to get newsletter subscribers',
    });
  }
});

module.exports = router;
