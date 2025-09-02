const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { requireAuth } = require('../middleware/auth');

// GET contact information
router.get('/getContactInfo', contactController.getContactInfo);

// POST contact form submission
router.post('/send-message', contactController.sendMessage);

// PUT update contact information (admin only)
router.put('/updateContact', requireAuth, contactController.updateContact);

module.exports = router;
