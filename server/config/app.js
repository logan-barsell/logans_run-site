const { prisma } = require('../db/prisma');
const redisClient = require('../utils/redisClient');
const { AppError } = require('../middleware/errorHandler');

// Get server URL based on environment
const getServerUrl = () => {
  return process.env.SERVER_URL || 'http://localhost:5000';
};

// Get configuration for a specific tenant
const getConfig = async tenantId => {
  const cacheKey = `config:${tenantId}`;

  // Check Redis cache first
  try {
    const cachedConfig = await redisClient.get(cacheKey);
    if (cachedConfig) {
      return JSON.parse(cachedConfig);
    }
  } catch (error) {
    console.warn('Redis cache read failed:', error.message);
  }

  const isDevelopment = process.env.NODE_ENV === 'development';

  let config;

  if (isDevelopment) {
    // Development configuration
    config = {
      appEnv: 'development',
      apiURL: 'http://localhost:5000/api',
      clientURL: 'http://localhost:3001',
      domain: 'localhost',
      appName: 'Bandsyte',
    };
  } else {
    // Production configuration - fetch from database
    try {
      // Get the first verified domain for this tenant
      const tenantDomain = await prisma.tenantDomain.findFirst({
        where: {
          tenantId: tenantId,
          verified: true,
        },
        select: {
          domain: true,
        },
      });

      if (!tenantDomain) {
        throw new AppError(
          `No verified domain found for tenant ${tenantId}`,
          404
        );
      }

      const domain = tenantDomain.domain;

      config = {
        appEnv: 'production',
        apiURL: `https://${domain}/api`,
        clientURL: `https://${domain}`,
        domain: domain,
        appName: 'Bandsyte',
      };
    } catch (error) {
      console.error('Error fetching tenant domain:', error);

      // Fallback to bandsyte.com if DB fails
      config = {
        appEnv: 'production',
        apiURL: 'https://bandsyte.com/api',
        clientURL: 'https://bandsyte.com',
        domain: 'bandsyte.com',
        appName: 'Bandsyte',
      };
    }
  }

  // Cache the result in Redis (with 1 hour TTL)
  try {
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(config));
  } catch (error) {
    console.warn('Redis cache write failed:', error.message);
  }

  return config;
};

module.exports = {
  getConfig,
  getServerUrl,
};
