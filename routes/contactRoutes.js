const ContactInfo = require('../models/ContactInfo');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = app => {
  // Initialize default admin user if none exists
  const initializeAdmin = async () => {
    try {
      const existingContact = await ContactInfo.findOne();
      if (!existingContact) {
        const hashedPassword = bcrypt.hashSync(
          process.env.DEFAULT_PASSWORD || 'adminPass',
          10
        );
        await ContactInfo.create({
          name: 'contactData',
          email: process.env.DEFAULT_EMAIL || 'admin@example.com',
          password: hashedPassword,
        });
        console.log('Default admin user created');
      }
    } catch (err) {
      console.error('Error initializing admin user:', err);
    }
  };

  // Call initialization on startup
  initializeAdmin();

  app.get('/api/getContactInfo', async (req, res) => {
    try {
      const info = await ContactInfo.find();
      res.status(200).send(info);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.post('/api/updateContact', async (req, res) => {
    const updatedInfo = req.body;
    try {
      const updatedContactInfo = await ContactInfo.updateOne(
        { name: 'contactData' },
        updatedInfo,
        { upsert: true }
      );
      res.status(200).send(req.body);
    } catch (err) {
      res.status(500).send(err);
    }
  });

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

  // JWT authentication middleware
  function requireAuth(req, res, next) {
    const token = req.cookies && req.cookies.token;
    if (!token) {
      return res.status(401).json({ authenticated: false });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ authenticated: false });
    }
  }

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
