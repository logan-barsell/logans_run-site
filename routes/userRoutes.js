const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth } = require('../middleware/auth');

router.get('/me', requireAuth, userController.getCurrentUser);
router.put('/me', requireAuth, userController.updateUser);

module.exports = router;
