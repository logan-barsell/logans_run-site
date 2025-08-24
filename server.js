const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const keys = require('./config/keys');
const { errorHandler } = require('./middleware/errorHandler');
const { generateCSRFToken } = require('./middleware/csrf');
const {
  requestLogger,
  compression,
  statusMonitor,
  healthCheck,
  detailedHealthCheck,
  metrics,
} = require('./middleware/monitoring');
const logger = require('./utils/logger');

mongoose.connect(keys.mongoURI);

const db = mongoose.connection;
db.on('error', error => {
  logger.error('Database connection error:', error);
});
db.once('open', function () {
  logger.info('✅ Database connected successfully');
});

const app = express();

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      process.env.REACT_APP_DOMAIN || 'http://localhost:3000',
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
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions));

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://cdn.jsdelivr.net',
          'https://fonts.googleapis.com',
        ],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // unsafe-eval needed for React dev
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:', 'http:'], // Allow images from any HTTPS source
        connectSrc: ["'self'", 'https:', 'http:'], // Allow API calls
        frameSrc: ["'self'", 'https://www.youtube.com'], // Allow YouTube embeds
      },
    },
    crossOriginEmbedderPolicy: false, // Disable for YouTube embeds
  })
);

// Monitoring and performance
app.use(compression); // Enable gzip compression
app.use(requestLogger); // Request logging
app.use(statusMonitor); // Real-time monitoring dashboard

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(bodyParser.json());
app.use(cookieParser());

app.use('/public', express.static(`public`));

require('./routes/authRoutes')(app);
require('./routes/userRoutes')(app);
require('./routes/billingRoutes')(app);
require('./routes/homeRoutes')(app);
require('./routes/bioRoutes')(app);
require('./routes/contactRoutes')(app);
require('./routes/mediaRoutes')(app);
require('./routes/musicRoutes')(app);
app.use(require('./routes/themeRoutes'));
app.use(require('./routes/showsSettingsRoutes'));
app.use(require('./routes/featuredVideosRoutes'));
app.use(require('./routes/featuredReleasesRoutes'));
app.use(require('./routes/merchConfigRoutes'));

app.get('/', (req, res) => {
  res.send('EXPRESS ===> REACT');
});

// CSRF token endpoint
app.get('/api/csrf-token', generateCSRFToken);

// Monitoring endpoints
app.get('/api/health', healthCheck);
app.get('/api/health/detailed', detailedHealthCheck);
app.get('/api/metrics', metrics);

// Error handling middleware (must be last)
app.use(errorHandler);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  logger.info(`🚀 Server is running on port ${PORT}`);
  logger.info(`📅 Server started at: ${new Date().toISOString()}`);
});
