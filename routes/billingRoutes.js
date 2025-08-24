const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');

router.get('/products', billingController.getProducts);
router.post(
  '/create-checkout-session',
  billingController.createCheckoutSession
);
router.get('/shipping', billingController.getShipping);
router.post('/products', billingController.createProduct);
router.put('/products/:id', billingController.updateProduct);
router.delete('/products/:id', billingController.deactivateProduct);

module.exports = router;
