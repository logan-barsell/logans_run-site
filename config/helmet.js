const helmet = require('helmet');

const helmetConfig = {
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
};

module.exports = helmet(helmetConfig);
