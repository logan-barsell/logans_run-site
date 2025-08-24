const express = require('express');
const router = express.Router();
const themeController = require('../controllers/themeController');

router.get('/api/theme', themeController.getTheme);
router.post('/api/updateTheme', themeController.updateTheme);

module.exports = router;
