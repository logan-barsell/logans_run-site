const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const {
  sendContactNotification,
  sendNewsletterConfirmation,
  sendNewsletterSignupNotification,
} = require('../services/emailService');
const themeService = require('../services/themeService');
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

module.exports = router;
