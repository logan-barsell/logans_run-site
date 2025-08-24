const express = require('express');
const router = express.Router();
const showsSettingsController = require('../controllers/showsSettingsController');

router.get('/api/showsSettings', showsSettingsController.getShowsSettings);
router.post(
  '/api/updateShowsSettings',
  showsSettingsController.updateShowsSettings
);

module.exports = router;
