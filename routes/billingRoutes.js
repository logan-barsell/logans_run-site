const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');
const { requireAuth } = require('../middleware/auth');

router.get('/products', requireAuth, billingController.getProducts);
router.post(
  '/create-checkout-session',
  requireAuth,
  billingController.createCheckoutSession
);
router.get('/shipping', requireAuth, billingController.getShipping);
router.post('/products', requireAuth, billingController.createProduct);
router.put('/products/:id', requireAuth, billingController.updateProduct);
router.delete(
  '/products/:id',
  requireAuth,
  billingController.deactivateProduct
);

module.exports = router;
