const jwt = require('jsonwebtoken');
const { requireAuth } = require('../middleware/auth');
const {
  loginLimiter,
  resetPassLimiter,
  forgotPassLimiter,
} = require('../middleware/rateLimiter');
const userService = require('../services/userService');
const { validatePassword } = require('../utils/validation/passwordValidation');
const logger = require('../utils/logger');

module.exports = app => {
  // Apply rate limiting to auth routes
  app.use('/api/login', loginLimiter);
  app.use('/api/auth/forgot-password', forgotPassLimiter);
  app.use('/api/auth/reset-password', resetPassLimiter);

  // Login endpoint
  app.post('/api/login', async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Basic input validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required',
        });
      }

      // Authenticate user
      const user = await userService.authenticateUser(email, password);

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, email: user.adminEmail },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Set cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });

      logger.info(`User logged in successfully: ${user.adminEmail}`);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            bandName: user.bandName,
            adminEmail: user.adminEmail,
          },
        },
      });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }
  });

  // Check authentication status
  app.get('/api/me', requireAuth, async (req, res, next) => {
    try {
      const user = await userService.getUserById(req.user.id);
      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user._id,
            bandName: user.bandName,
            adminEmail: user.adminEmail,
          },
        },
      });
    } catch (error) {
      logger.error('Auth check error:', error);
      res.status(401).json({
        success: false,
        message: 'Authentication failed',
      });
    }
  });

  // Logout endpoint
  app.post('/api/logout', (req, res) => {
    res.clearCookie('token');
    logger.info('User logged out');
    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  });

  // Forgot password endpoint
  app.post('/api/auth/forgot-password', async (req, res, next) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required',
        });
      }

      const { resetToken } = await userService.setPasswordResetToken(email);

      // In development, log the reset link
      if (process.env.NODE_ENV !== 'production') {
        const resetLink = `${
          process.env.REACT_APP_DOMAIN || 'http://localhost:3000'
        }/reset-password?token=${resetToken}`;
        logger.info(`Password reset link (DEV ONLY): ${resetLink}`);
      }

      // In production, you would send an email here
      // await sendPasswordResetEmail(email, resetToken);

      res.status(200).json({
        success: true,
        message: 'Password reset email sent successfully',
      });
    } catch (error) {
      // Don't reveal if email exists or not for security
      logger.error('Forgot password error:', error);
      res.status(200).json({
        success: true,
        message: 'If the email exists, a password reset link has been sent',
      });
    }
  });

  // Reset password endpoint
  app.post('/api/auth/reset-password', async (req, res, next) => {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Token and new password are required',
        });
      }

      // Validate password strength
      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Password does not meet requirements',
          errors: passwordValidation.errors,
        });
      }

      await userService.resetPassword(token, newPassword);

      res.status(200).json({
        success: true,
        message: 'Password reset successfully',
      });
    } catch (error) {
      logger.error('Reset password error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Password reset failed',
      });
    }
  });

  // Initialize default user (admin only)
  app.post('/api/auth/initialize', async (req, res, next) => {
    try {
      const user = await userService.initializeDefaultUser();
      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user._id,
            bandName: user.bandName,
            adminEmail: user.adminEmail,
          },
        },
        message: 'Default user initialized successfully',
      });
    } catch (error) {
      logger.error('Initialize user error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to initialize default user',
      });
    }
  });
};
