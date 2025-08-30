const express = require('express');
const router = express.Router();
const merchConfigController = require('../controllers/merchConfigController');
const { requireAuth } = require('../middleware/auth');

router.get('/api/merchConfig', merchConfigController.getMerchConfig);
router.get(
  '/api/merchConfig/admin',
  requireAuth,
  merchConfigController.getMerchConfigAdmin
);
router.post(
  '/api/merchConfig',
  requireAuth,
  merchConfigController.updateMerchConfig
);
router.delete(
  '/api/merchConfig',
  requireAuth,
  merchConfigController.deleteMerchConfig
);

module.exports = router;
