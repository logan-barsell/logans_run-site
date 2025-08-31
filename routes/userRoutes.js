const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth } = require('../middleware/auth');

router.put('/me', requireAuth, userController.updateUser);

// Security endpoints
router.put('/change-password', requireAuth, userController.changePassword);
router.get('/sessions', requireAuth, userController.getSessions);
router.delete('/sessions/:sessionId', requireAuth, userController.endSession);
router.delete('/sessions', requireAuth, userController.endAllOtherSessions);

module.exports = router;
