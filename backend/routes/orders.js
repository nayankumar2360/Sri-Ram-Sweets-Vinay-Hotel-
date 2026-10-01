const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrder, submitPayment } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { uploadPaymentScreenshot } = require('../middleware/upload');

router.use(protect);

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrder);
router.post('/:id/payment', uploadPaymentScreenshot, submitPayment);

module.exports = router;
