const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const logger = require('../utils/logger');

/**
 * SES Service
 *
 * Handles AWS SES bounce and complaint notifications
 * Processes SNS messages and updates subscriber status accordingly
 */

/**
 * Verify SNS message signature (security)
 */
function verifySNSMessage(_req, body) {
  try {
    // For now, we'll trust the message format
    // In production, you should verify SNS signatures
    // See: https://docs.aws.amazon.com/sns/latest/dg/sns-verify-signature-of-message.html

    if (!body || !body.Type) {
      return false;
    }

    return true;
  } catch (error) {
    logger.error('❌ SNS message verification failed:', error);
    return false;
  }
}

/**
 * Handle bounce notifications
 */
async function handleBounce(bounceData) {
  const { bounceType, bouncedRecipients } = bounceData;

  logger.info(
    `📧 Processing bounce: ${bounceType} for ${bouncedRecipients.length} recipients`
  );

  for (const recipient of bouncedRecipients) {
    try {
      const email = recipient.emailAddress;
      const bounceSubType = recipient.bounceSubType || 'General';

      // For hard bounces, immediately deactivate subscriber
      if (bounceType === 'Permanent') {
        await NewsletterSubscriber.updateOne(
          { email: email.toLowerCase() },
          {
            isActive: false,
            bouncedAt: new Date(),
            bounceType: bounceSubType,
            bounceReason: recipient.diagnosticCode || 'Permanent bounce',
          }
        );
        logger.info(`📧 Hard bounce: deactivated ${email} (${bounceSubType})`);
      }
      // For soft bounces, you might want to implement retry logic
      else if (bounceType === 'Transient') {
        // Log soft bounce for monitoring
        logger.warn(`📧 Soft bounce: ${email} (${bounceSubType})`);
        // Could implement retry logic here based on bounceSubType
      }
    } catch (error) {
      logger.error(
        `❌ Failed to process bounce for ${recipient.emailAddress}:`,
        error
      );
      throw error;
    }
  }
}

/**
 * Handle complaint notifications
 */
async function handleComplaint(complaintData) {
  const { complainedRecipients } = complaintData;

  logger.info(
    `📧 Processing complaint for ${complainedRecipients.length} recipients`
  );

  for (const recipient of complainedRecipients) {
    try {
      const email = recipient.emailAddress;

      // Immediately deactivate subscriber on complaint (CAN-SPAM requirement)
      await NewsletterSubscriber.updateOne(
        { email: email.toLowerCase() },
        {
          isActive: false,
          unsubscribedAt: new Date(),
          unsubscribeReason: 'complaint',
          complaintType: recipient.complaintFeedbackType || 'abuse',
        }
      );

      logger.info(`📧 Complaint processed: deactivated ${email}`);
    } catch (error) {
      logger.error(
        `❌ Failed to process complaint for ${recipient.emailAddress}:`,
        error
      );
      throw error;
    }
  }
}

/**
 * Handle delivery notifications (for logging)
 */
async function handleDelivery(deliveryData) {
  // Log successful deliveries for monitoring
  logger.info(
    `📧 Email delivered successfully to ${
      deliveryData.recipients?.length || 0
    } recipients`
  );
}

/**
 * Handle send notifications (for logging)
 */
async function handleSend(sendData) {
  // Log successful sends for monitoring
  logger.info(
    `📧 Email sent successfully to ${
      sendData.destination?.ToAddresses?.length || 0
    } recipients`
  );
}

/**
 * Get SES throttler status for monitoring
 */
function getSESThrottlerStatus() {
  const sesThrottler = require('../utils/sesThrottler');
  return sesThrottler.getQueueStatus();
}

/**
 * Emergency stop for SES throttler
 */
function emergencyStopSESThrottler() {
  const sesThrottler = require('../utils/sesThrottler');
  return sesThrottler.emergencyStop();
}

/**
 * Process SES notification
 */
async function processSESNotification(
  notificationType,
  _mail,
  bounce,
  complaint,
  delivery,
  send
) {
  try {
    // Route to appropriate handler
    switch (notificationType) {
      case 'Bounce':
        if (bounce) await handleBounce(bounce);
        break;

      case 'Complaint':
        if (complaint) await handleComplaint(complaint);
        break;

      case 'Delivery':
        if (delivery) await handleDelivery(delivery);
        break;

      case 'Send':
        if (send) await handleSend(send);
        break;

      default:
        logger.info(`📧 Unhandled notification type: ${notificationType}`);
    }

    logger.info(`📧 Processed SES notification: ${notificationType}`);
  } catch (error) {
    logger.error(
      `❌ Failed to process SES notification ${notificationType}:`,
      error
    );
    throw error;
  }
}

module.exports = {
  verifySNSMessage,
  getSESThrottlerStatus,
  emergencyStopSESThrottler,
  processSESNotification,
};
