const express = require('express');
const router = express.Router();
const musicController = require('../controllers/musicController');
const { requireAuth } = require('../middleware/auth');

// Public routes (used by public site)
router.get('/getPlayers', musicController.getPlayers);

// Admin routes (require authentication)
router.post('/addPlayer', requireAuth, musicController.addPlayer);
router.post('/updatePlayer', requireAuth, musicController.updatePlayer);
router.get('/deletePlayer/:id', requireAuth, musicController.deletePlayer);
router.get('/getPlayer/:id', requireAuth, musicController.getPlayer);

module.exports = router;
