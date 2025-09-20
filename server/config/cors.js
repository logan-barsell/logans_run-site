const cors = require('cors');
const logger = require('../utils/logger');
const { prisma } = require('../db/prisma');

const corsOptions = {
  origin: async function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:3002',
    ];

    // Add development domain
    if (process.env.NEXT_PUBLIC_DOMAIN) {
      allowedOrigins.push(process.env.NEXT_PUBLIC_DOMAIN);
    }

    // Check if origin is in the static allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }

    // In production, check if origin is a valid tenant domain
    if (process.env.NODE_ENV === 'production') {
      try {
        // Extract domain from origin (remove protocol)
        const domain = origin.replace(/^https?:\/\//, '');

        // Check if it's a custom domain
        const customDomainTenant = await prisma.tenant.findUnique({
          where: { domain: domain },
        });

        if (customDomainTenant) {
          return callback(null, true);
        }

        // Check if it's a subdomain
        if (domain.endsWith('.bandsyte.com')) {
          const subdomain = domain.replace('.bandsyte.com', '');
          const subdomainTenant = await prisma.tenant.findUnique({
            where: { subDomain: subdomain },
          });

          if (subdomainTenant) {
            return callback(null, true);
          }
        }

        // Always allow the main bandsyte.com domain
        if (domain === 'bandsyte.com' || domain === 'www.bandsyte.com') {
          return callback(null, true);
        }
      } catch (error) {
        logger.warn('CORS tenant lookup failed:', error);
        // Continue to deny the request if lookup fails
      }
    }

    logger.warn(`CORS blocked request from origin: ${origin}`);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-Tenant-ID',
    'X-CSRF-Token',
  ],
  optionsSuccessStatus: 200, // For legacy browser support
};

module.exports = cors(corsOptions);
