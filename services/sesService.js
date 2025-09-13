const { prisma } = require('../db/prisma');
const { withTenant } = require('../db/withTenant');
const { addToSuppression } = require('./sesSuppression');
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
        const normalized = email.toLowerCase();
        // Find impacted tenantIds first, then update per-tenant under withTenant
        const impactedTenants = await prisma.newsletterSubscriber.findMany({
          where: { email: normalized },
          select: { tenantId: true },
          distinct: ['tenantId'],
        });

        for (const { tenantId } of impactedTenants) {
          await withTenant(tenantId, async tx =>
            tx.newsletterSubscriber.updateMany({
              where: { tenantId, email: normalized },
              data: {
                isActive: false,
                bouncedAt: new Date(),
                bounceType: bounceSubType,
                bounceReason: recipient.diagnosticCode || 'Permanent bounce',
              },
            })
          );
        }

        // Add to SES suppression list for account-level blocking
        await addToSuppression(email, 'BOUNCE');
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
      const normalized = email.toLowerCase();
      const impactedTenants = await prisma.newsletterSubscriber.findMany({
        where: { email: normalized },
        select: { tenantId: true },
        distinct: ['tenantId'],
      });

      for (const { tenantId } of impactedTenants) {
        await withTenant(tenantId, async tx =>
          tx.newsletterSubscriber.updateMany({
            where: { tenantId, email: normalized },
            data: {
              isActive: false,
              unsubscribedAt: new Date(),
              unsubscribeReason: 'complaint',
              complaintType: recipient.complaintFeedbackType || 'abuse',
            },
          })
        );
      }

      // Add to SES suppression list for account-level blocking
      await addToSuppression(email, 'COMPLAINT');
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
