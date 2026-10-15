const express = require('express');
const router = express.Router();
const festivalController = require('../controllers/festivalController');
const { protect, requireOwner } = require('../middleware/auth');
const { uploadFestivalBanner } = require('../middleware/upload');

// Public routes
router.get('/', festivalController.getFestivals);
router.get('/live', festivalController.getLiveBanner);
router.get('/:slugOrId', festivalController.getFestivalBySlugOrId);
router.get('/:slugOrId/products', festivalController.getFestivalProducts);

// Protected owner routes
router.post('/seed', protect, requireOwner, festivalController.seedFestivals);
router.post('/', protect, requireOwner, uploadFestivalBanner, festivalController.createFestival);
router.put('/:id', protect, requireOwner, uploadFestivalBanner, festivalController.updateFestival);
router.patch('/:id/banner', protect, requireOwner, uploadFestivalBanner, festivalController.updateBanner);
router.patch('/:id/preorders', protect, requireOwner, festivalController.updatePreorderControl);
router.patch('/:id/capacity', protect, requireOwner, festivalController.updateCapacity);
router.delete('/:id', protect, requireOwner, festivalController.deleteFestival);

module.exports = router;
