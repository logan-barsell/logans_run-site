const express = require('express');
const router = express.Router();
const SESController = require('../controllers/sesController');

/**
 * AWS SES Bounce and Complaint Notification Handler
 *
 * This endpoint receives SNS notifications from AWS SES when:
 * - Emails bounce (hard/soft bounces)
 * - Recipients mark emails as spam/complaint
 * - Emails are delivered successfully
 *
 * Required AWS SES Setup:
 * 1. Create an SNS topic for bounce/complaint notifications
 * 2. Configure SES to send notifications to this SNS topic
 * 3. Subscribe this webhook URL to the SNS topic
 * 4. Set up proper SNS message filtering (optional)
 */

/**
 * Main SES notification handler
 */
router.post(
  '/notifications',
  express.raw({ type: 'application/json', limit: '10mb' }),
  SESController.handleSESNotification
);

/**
 * SES throttler status (admin only)
 */
router.get('/throttler-status', SESController.getSESThrottlerStatus);

/**
 * SES configuration status (admin only)
 */
router.get('/config-status', SESController.getSESConfigStatus);

/**
 * Health check endpoint for SES webhook
 */
router.get('/notifications/health', SESController.healthCheck);

module.exports = router;
