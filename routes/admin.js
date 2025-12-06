const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin/admin');


router.get('/add-product', adminController.getAddProduct);
router.get('/admin-products', adminController.getAdminProducts);
router.get('/edit-product/:productId', adminController.editProduct);


router.post('/delete-product/:productId', adminController.postDeleteProduct);
router.post('/add-product', adminController.postAddProduct);


module.exports = router;
