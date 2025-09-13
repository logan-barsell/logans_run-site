const logger = require('../utils/logger');

let sesv2 = null;
function getClient() {
  if (sesv2) return sesv2;
  const { SESv2Client } = require('@aws-sdk/client-sesv2');
  sesv2 = new SESv2Client({ region: process.env.AWS_REGION || 'us-east-1' });
  return sesv2;
}

async function addToSuppression(email, reason = 'BOUNCE') {
  try {
    const {
      PutSuppressedDestinationCommand,
    } = require('@aws-sdk/client-sesv2');
    const client = getClient();
    const command = new PutSuppressedDestinationCommand({
      EmailAddress: String(email || '').toLowerCase(),
      Reason: reason, // 'BOUNCE' | 'COMPLAINT'
    });
    await client.send(command);
    logger.info(`📧 Added to SES suppression: ${email} (${reason})`);
    return true;
  } catch (error) {
    logger.warn(`📧 Failed to add to suppression (${email}): ${error.message}`);
    return false;
  }
}

async function isSuppressed(email) {
  try {
    const {
      GetSuppressedDestinationCommand,
    } = require('@aws-sdk/client-sesv2');
    const client = getClient();
    const command = new GetSuppressedDestinationCommand({
      EmailAddress: String(email || '').toLowerCase(),
    });
    await client.send(command);
    return true;
  } catch (_err) {
    return false;
  }
}

async function removeFromSuppression(email) {
  try {
    const {
      DeleteSuppressedDestinationCommand,
    } = require('@aws-sdk/client-sesv2');
    const client = getClient();
    const command = new DeleteSuppressedDestinationCommand({
      EmailAddress: String(email || '').toLowerCase(),
    });
    await client.send(command);
    logger.info(`📧 Removed from SES suppression: ${email}`);
    return true;
  } catch (error) {
    logger.warn(
      `📧 Failed to remove from suppression (${email}): ${error.message}`
    );
    return false;
  }
}

module.exports = { addToSuppression, isSuppressed, removeFromSuppression };
