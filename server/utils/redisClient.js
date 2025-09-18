const { createClient } = require('redis');
const logger = require('./logger');

const isTest = process.env.NODE_ENV === 'test';

const redisClient = isTest
  ? {
      connect: jest.fn(),
      set: jest.fn(),
      get: jest.fn(),
      del: jest.fn(),
      quit: jest.fn(),
      on: jest.fn(),
    }
  : createClient({
      url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
    });

if (!isTest) {
  redisClient.on('error', err =>
    logger.error('❌ Redis Client Error', { error: err })
  );
  redisClient.connect().then(() => {
    logger.info('✅ Connected to Redis');
  });
}

module.exports = redisClient;
