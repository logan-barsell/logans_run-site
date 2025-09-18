const { generateCSRFToken } = require('../middleware/csrf');

const setupRoutes = app => {
  // Utility routes
  app.get('/api/csrf-token', generateCSRFToken);
  app.get('/api/whoami', (req, res) => {
    res.json({ tenantId: req.tenantId });
  });

  // API Routes
  app.use('/api/auth', require('../routes/authRoutes'));
  app.use('/api/user', require('../routes/userRoutes'));
  app.use('/api/2fa', require('../routes/twoFactorRoutes'));
  app.use(
    '/api/security-preferences',
    require('../routes/securityPreferencesRoutes')
  );
  app.use('/api', require('../routes/billingRoutes'));
  app.use('/api', require('../routes/homeRoutes'));
  app.use('/api', require('../routes/bioRoutes'));
  app.use('/api', require('../routes/contactRoutes'));
  app.use('/api/newsletter', require('../routes/newsletterRoutes'));
  app.use('/api/ses', require('../routes/sesRoutes'));
  app.use('/api', require('../routes/mediaRoutes'));
  app.use('/api', require('../routes/musicRoutes'));
  app.use('/', require('../routes/themeRoutes'));
  app.use('/', require('../routes/showsSettingsRoutes'));
  app.use('/', require('../routes/featuredVideosRoutes'));
  app.use('/', require('../routes/featuredReleasesRoutes'));
  app.use('/', require('../routes/merchConfigRoutes'));
};

module.exports = setupRoutes;
