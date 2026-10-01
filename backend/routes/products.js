const express = require('express');
const router = express.Router();
const { getProducts, getProduct, getCategories, getPublicSettings } = require('../controllers/productController');

router.get('/products', getProducts);
router.get('/products/:id', getProduct);
router.get('/categories', getCategories);
router.get('/settings/public', getPublicSettings);

module.exports = router;
