const express = require('express');
const router = express.Router();
const { createBulkOrder, getBulkOrders, getBulkOrder } = require('../controllers/bulkOrderController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', createBulkOrder);
router.get('/', getBulkOrders);
router.get('/:id', getBulkOrder);

module.exports = router;
