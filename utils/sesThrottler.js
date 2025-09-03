const logger = require('./logger');

/**
 * AWS SES Throttler
 *
 * Implements proper throttling to respect AWS SES sending limits:
 * - Sending Rate: 14 messages per second
 * - Daily Limit: 50,000 messages per day
 *
 * Features:
 * - Queue-based sending with proper delays
 * - Burst handling within rate limits
 * - Automatic retry with exponential backoff
 * - Comprehensive logging and monitoring
 */

class SESThrottler {
  constructor() {
    // AWS SES Limits (configured based on your account)
    this.maxSendRate = 14; // messages per second
    this.dailyLimit = 50000; // messages per day
    this.maxBurstSize = 10; // maximum burst size

    // Queue management
    this.emailQueue = [];
    this.isProcessing = false;
    this.sentToday = 0;
    this.lastResetDate = new Date().toDateString();

    // Timing controls
    this.minDelayBetweenEmails = Math.ceil(1000 / this.maxSendRate); // ~71ms between emails
    this.lastEmailSent = 0;

    // Retry configuration
    this.maxRetries = 3;
    this.retryDelay = 1000; // 1 second base retry delay

    // Daily reset timer
    this.resetDailyCounter();
  }

  /**
   * Reset daily email counter at midnight
   */
  resetDailyCounter() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const timeUntilMidnight = tomorrow - now;

    setTimeout(() => {
      this.sentToday = 0;
      this.lastResetDate = new Date().toDateString();
      logger.info('📧 Daily email counter reset');
      this.resetDailyCounter(); // Schedule next reset
    }, timeUntilMidnight);
  }

  /**
   * Add email to the sending queue
   */
  async queueEmail(emailData) {
    return new Promise((resolve, reject) => {
      this.emailQueue.push({
        ...emailData,
        resolve,
        reject,
        retries: 0,
        queuedAt: Date.now(),
      });

      logger.info(
        `📧 Email queued: ${emailData.to} - Queue length: ${this.emailQueue.length}`
      );

      // Start processing if not already running
      if (!this.isProcessing) {
        this.processQueue();
      }
    });
  }

  /**
   * Process the email queue with proper throttling
   */
  async processQueue() {
    if (this.isProcessing || this.emailQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.emailQueue.length > 0) {
      const emailData = this.emailQueue[0];

      try {
        // Check daily limit
        if (this.sentToday >= this.dailyLimit) {
          logger.warn('📧 Daily email limit reached, pausing queue processing');
          // Wait until next day (this will be handled by the daily reset)
          break;
        }

        // Calculate delay to respect sending rate
        const now = Date.now();
        const timeSinceLastEmail = now - this.lastEmailSent;
        const requiredDelay = Math.max(
          0,
          this.minDelayBetweenEmails - timeSinceLastEmail
        );

        if (requiredDelay > 0) {
          await this.delay(requiredDelay);
        }

        // Send the email
        await this.sendEmailWithRetry(emailData);

        // Update counters
        this.sentToday++;
        this.lastEmailSent = Date.now();

        // Remove from queue and resolve
        this.emailQueue.shift();
        emailData.resolve();

        logger.info(
          `📧 Email sent successfully: ${emailData.to} (${this.sentToday}/${this.dailyLimit} today)`
        );
      } catch (error) {
        logger.error(
          `❌ Failed to send email after ${this.maxRetries} retries:`,
          error
        );

        // Remove from queue and reject
        this.emailQueue.shift();
        emailData.reject(error);
      }
    }

    this.isProcessing = false;
  }

  /**
   * Send email with retry logic
   */
  async sendEmailWithRetry(emailData) {
    let lastError;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await this.sendSingleEmail(emailData);
      } catch (error) {
        lastError = error;

        if (attempt < this.maxRetries) {
          const delay = this.retryDelay * Math.pow(2, attempt); // Exponential backoff
          logger.warn(
            `📧 Email send attempt ${
              attempt + 1
            } failed, retrying in ${delay}ms:`,
            error.message
          );
          await this.delay(delay);
        }
      }
    }

    throw lastError;
  }

  /**
   * Send a single email via AWS SES
   */
  async sendSingleEmail(emailData) {
    const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

    const sesClient = new SESClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const params = {
      Source:
        emailData.from || process.env.FROM_EMAIL || 'noreply@bandsyte.com',
      Destination: {
        ToAddresses: [emailData.to],
      },
      Message: {
        Subject: {
          Data: emailData.subject,
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: emailData.html,
            Charset: 'UTF-8',
          },
        },
      },
    };

    const command = new SendEmailCommand(params);
    const result = await sesClient.send(command);

    return result;
  }

  /**
   * Utility method for delays
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get current queue status
   */
  getQueueStatus() {
    return {
      queueLength: this.emailQueue.length,
      isProcessing: this.isProcessing,
      sentToday: this.sentToday,
      dailyLimit: this.dailyLimit,
      sendRate: this.maxSendRate,
      lastEmailSent: this.lastEmailSent
        ? new Date(this.lastEmailSent).toISOString()
        : null,
    };
  }

  /**
   * Emergency stop - clear queue and stop processing
   */
  emergencyStop() {
    logger.warn('🚨 Emergency stop activated - clearing email queue');
    this.emailQueue.forEach(email => {
      email.reject(new Error('Email sending stopped due to emergency stop'));
    });
    this.emailQueue = [];
    this.isProcessing = false;
  }
}

// Export singleton instance
const sesThrottler = new SESThrottler();

module.exports = sesThrottler;
