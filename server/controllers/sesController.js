const SESService = require('../services/sesService');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');
const BandEmailService = require('../services/bandEmailService');

// SNS message types we handle
const MESSAGE_TYPES = {
  BOUNCE: 'Bounce',
  COMPLAINT: 'Complaint',
  DELIVERY: 'Delivery',
  SEND: 'Send',
  REJECT: 'Reject',
  OPEN: 'Open',
  CLICK: 'Click',
  RENDERING_FAILURE: 'Rendering Failure',
  DELIVERY_DELAY: 'DeliveryDelay',
  SUBSCRIPTION: 'SubscriptionConfirmation',
};

/**
 * Handle SES notifications
 */
async function handleSESNotification(req, res, next) {
  try {
    // Parse SNS message
    let body;
    try {
      body = JSON.parse(req.body);
    } catch (error) {
      logger.error('❌ Failed to parse SNS message body');
      throw new AppError('Invalid JSON in request body', 400);
    }

    // Verify SNS message (basic verification)
    if (!SESService.verifySNSMessage(req, body)) {
      logger.warn('⚠️ Invalid SNS message received');
      throw new AppError('Invalid SNS message', 400);
    }

    const { Type, Message } = body;

    // Handle subscription confirmation
    if (Type === 'SubscriptionConfirmation') {
      logger.info('📧 SNS Subscription confirmation received');
      // In production, you should automatically visit this URL
      // For now, we'll just log it
      return res.status(200).send('Subscription noted');
    }

    // Handle notification messages
    if (Type === 'Notification' && Message) {
      let messageData;
      try {
        messageData = JSON.parse(Message);
      } catch (error) {
        logger.error('❌ Failed to parse SNS message content');
        throw new AppError('Invalid message content', 400);
      }

      const { notificationType, mail, bounce, complaint, delivery, send } =
        messageData;

      // Process the notification
      await SESService.processSESNotification(
        notificationType,
        mail,
        bounce,
        complaint,
        delivery,
        send
      );

      return res.status(200).send('Notification processed');
    }

    // Unknown message type
    logger.warn(`⚠️ Unknown SNS message type: ${Type}`);
    res.status(200).send('Message type not handled');
  } catch (error) {
    logger.error('❌ SES notification handler error:', error);
    next(error);
  }
}

/**
 * Get SES throttler status (admin only)
 */
async function getSESThrottlerStatus(req, res, next) {
  try {
    const status = SESService.getSESThrottlerStatus();

    res.status(200).json({
      success: true,
      data: status,
    });
  } catch (error) {
    logger.error('❌ Failed to get SES throttler status:', error);
    next(error);
  }
}

/**
 * Get SES configuration status (admin only)
 */
async function getSESConfigStatus(req, res, next) {
  try {
    const bandId = req.query.bandId;
    const status = await BandEmailService.getSESStatus(bandId);

    res.status(200).json({
      success: true,
      data: status,
    });
  } catch (error) {
    logger.error('❌ Failed to get SES configuration status:', error);
    next(error);
  }
}

/**
 * Health check endpoint
 */
async function healthCheck(req, res, next) {
  try {
    res.status(200).json({
      status: 'OK',
      message: 'SES notification webhook is healthy',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  handleSESNotification,
  getSESThrottlerStatus,
  getSESConfigStatus,
  healthCheck,
};
