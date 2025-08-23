const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ContactInfo = require('../models/ContactInfo');
const crypto = require('crypto');
const { requireAuth } = require('../middleware/auth');

module.exports = app => {
  // Initialize admin user if it doesn't exist
  const initializeAdmin = async () => {
    try {
      const existingContact = await ContactInfo.findOne();
      if (!existingContact) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const contactInfo = new ContactInfo({
          name: 'contactData',
          email: 'admin@example.com',
          password: hashedPassword,
          phone: '',
          facebook: '',
          instagram: '',
          youtube: '',
          spotify: '',
          appleMusic: '',
          soundcloud: '',
          x: '',
          tiktok: '',
        });
        await contactInfo.save();
        console.log('Admin user initialized');
      }
    } catch (err) {
      console.error('Error initializing admin user:', err);
    }
  };

  // Call initialization on startup
  initializeAdmin();

  // Login endpoint
  app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const contactInfo = await ContactInfo.findOne();
      if (!contactInfo || email !== contactInfo.email) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const valid = await bcrypt.compare(password, contactInfo.password);
      if (!valid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 60 * 60 * 1000, // 1 hour
      });
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Login failed' });
    }
  });

  // Forgot password endpoint
  app.post('/api/auth/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
      const contactInfo = await ContactInfo.findOne();
      if (!contactInfo || email !== contactInfo.email) {
        // Don't reveal if email exists or not for security
        return res.json({
          success: true,
          message: 'If the email exists, a reset link has been sent.',
        });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

      // Store reset token in contact info (you might want to create a separate model for this)
      await ContactInfo.updateOne(
        { name: 'contactData' },
        {
          resetToken,
          resetTokenExpiry,
        }
      );

      // TODO: SEND PASSWORD RESET EMAIL
      const resetLink = `${req.protocol}://${req.get(
        'host'
      )}/reset-password?token=${resetToken}`;
      console.log('Password reset link:', resetLink);

      res.json({
        success: true,
        message: 'If the email exists, a reset link has been sent.',
      });
    } catch (err) {
      console.error('Password reset error:', err);
      res
        .status(500)
        .json({ error: 'Failed to process password reset request' });
    }
  });

  // Reset password endpoint
  app.post('/api/auth/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    try {
      const contactInfo = await ContactInfo.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: new Date() },
      });

      if (!contactInfo) {
        return res
          .status(400)
          .json({ error: 'Invalid or expired reset token' });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password and clear reset token
      await ContactInfo.updateOne(
        { name: 'contactData' },
        {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpiry: null,
        }
      );

      // TODO: SEND PASSWORD RESET SUCCESS EMAIL

      res.json({ success: true, message: 'Password reset successfully' });
    } catch (err) {
      console.error('Password reset error:', err);
      res.status(500).json({ error: 'Failed to reset password' });
    }
  });

  // Endpoint to check authentication status
  app.get('/api/me', (req, res) => {
    const token = req.cookies && req.cookies.token;
    if (!token) {
      return res.json({ authenticated: false });
    }
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      return res.json({ authenticated: true });
    } catch (err) {
      return res.json({ authenticated: false });
    }
  });

  // Logout endpoint
  app.post('/api/logout', (req, res) => {
    res.cookie('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 0,
    });
    res.json({ success: true });
  });
};
