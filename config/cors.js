const cors = require('cors');
const logger = require('../utils/logger');

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:3002',
      process.env.REACT_APP_DOMAIN || 'http://localhost:3000',
      process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3001',
    ];

    // In production, add your actual domain
    if (process.env.NODE_ENV === 'production') {
      allowedOrigins.push(
        process.env.PRODUCTION_DOMAIN || 'https://yourdomain.com'
      );
    }

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      logger.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
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
