const express = require('express');
const router = express.Router();
const merchConfigController = require('../controllers/merchConfigController');

router.get('/api/merchConfig', merchConfigController.getMerchConfig);
router.get('/api/merchConfig/admin', merchConfigController.getMerchConfigAdmin);
router.post('/api/merchConfig', merchConfigController.updateMerchConfig);
router.delete('/api/merchConfig', merchConfigController.deleteMerchConfig);

module.exports = router;
