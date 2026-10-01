const express = require('express');
const router = express.Router();
const { createPreOrder, getPreOrders, getPreOrder, checkCapacity, getFestivals, submitPayment } = require('../controllers/preOrderController');
const { protect } = require('../middleware/auth');
const { uploadPaymentScreenshot } = require('../middleware/upload');

// Public endpoints for browsing festivals and checking capacity
router.get('/check-capacity', checkCapacity);
router.get('/capacity/check', checkCapacity);
router.get('/festivals', getFestivals);
router.get('/festivals/active', getFestivals);

// Protected endpoints for placing and managing pre-orders
router.use(protect);

router.post('/', createPreOrder);
router.get('/', getPreOrders);
router.get('/:id', getPreOrder);
router.post('/:id/payment', uploadPaymentScreenshot, submitPayment);

module.exports = router;
