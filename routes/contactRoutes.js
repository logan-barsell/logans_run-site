const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

router.get('/getContactInfo', contactController.getContactInfo);
router.post('/updateContact', contactController.updateContact);

module.exports = router;
