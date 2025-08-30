const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const { requireAuth } = require('../middleware/auth');

// Public routes (used by public site)
router.get('/getHomeImages', homeController.getHomeImages);
router.get('/shows', homeController.getShows);

// Admin routes (require authentication)
router.get('/removeImage/:id', requireAuth, homeController.removeImage);
router.post('/addHomeImage', requireAuth, homeController.addHomeImage);
router.post('/addShow', requireAuth, homeController.addShow);
router.post('/updateShow/:id', requireAuth, homeController.updateShow);
router.get('/deleteShow/:id', requireAuth, homeController.deleteShow);

module.exports = router;
