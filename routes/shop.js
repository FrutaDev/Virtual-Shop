const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shop/shop');

router.get('/products', shopController.getProducts);
router.get('/cart', shopController.getCart);
router.post('/cart/:productId', shopController.addToCart);
router.post('/cart/delete-item/:productId', shopController.removeFromCart);
router.get('/orders', shopController.getOrders);
router.post('/order', shopController.newOrder);
router.get('/', shopController.getAllProducts);

module.exports = router;
