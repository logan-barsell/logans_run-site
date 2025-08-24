const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

// Define log levels
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Create logs directory if it doesn't exist
const fs = require('fs');
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// File transport (rotates logs daily)
const fileTransport = new DailyRotateFile({
  filename: path.join(logsDir, 'app-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m', // 20MB max file size
  maxFiles: '14d', // Keep logs for 14 days
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
});

// Console transport for development
const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
      // Create a clean log format without any padding or colorization
      let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;

      // Add stack trace if available
      if (stack) {
        log += `\n${stack}`;
      }

      // Add additional metadata if present (without extra indentation)
      if (Object.keys(meta).length > 0) {
        log += `\nMetadata: ${JSON.stringify(meta)}`;
      }

      return log;
    })
  ),
});

const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

// Configure logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'test' ? 'silent' : LOG_LEVEL,
  levels: logLevels,
  transports: [fileTransport, consoleTransport],
  // Handle uncaught exceptions
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'exceptions.log'),
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],
  // Handle unhandled rejections
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'rejections.log'),
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],
});

// Add CloudWatch transport if AWS is configured (for future use)
if (process.env.AWS_CLOUDWATCH === 'enabled' && process.env.AWS_ACCESS_KEY_ID) {
  try {
    const WinstonCloudWatch = require('winston-cloudwatch');
    logger.add(
      new WinstonCloudWatch({
        logGroupName: 'BandsyteLogs',
        logStreamName: 'backend',
        awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
        awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
        awsRegion: process.env.AWS_REGION || 'us-east-1',
      })
    );
    logger.info('✅ CloudWatch logging enabled');
  } catch (error) {
    logger.warn('⚠️ CloudWatch not available, using file logging only');
  }
}

module.exports = logger;
