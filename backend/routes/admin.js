const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, requireOwner } = require('../middleware/auth');
const { uploadProductImage } = require('../middleware/upload');

router.use(protect, requireOwner);

// Dashboard
router.get('/dashboard', adminController.getDashboard);

// Analytics
router.get('/analytics', adminController.getAnalytics);
router.get('/analytics/festivals', adminController.getFestivalAnalytics);
router.get('/analytics/products', adminController.getProductAnalytics);

// Products
router.get('/products', adminController.getProducts);
router.post('/products', uploadProductImage, adminController.createProduct);
router.put('/products/:id', uploadProductImage, adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);
router.patch('/products/:id/availability', adminController.toggleAvailability);

// Categories
router.get('/categories', adminController.getCategories);
router.post('/categories', adminController.createCategory);
router.put('/categories/:id', adminController.updateCategory);
router.delete('/categories/:id', adminController.deleteCategory);

// Orders
router.get('/orders', adminController.getOrders);
router.get('/orders/:id', adminController.getOrder);
router.put('/orders/:id/accept', adminController.acceptOrder);
router.put('/orders/:id/reject', adminController.rejectOrder);
router.put('/orders/:id/status', adminController.updateOrderStatus);

// Payments
router.get('/payments', adminController.getPayments);
router.put('/payments/:id/verify', adminController.verifyPayment);
router.put('/payments/:id/reject', adminController.rejectPayment);

// Pre-Orders
router.get('/preorders', adminController.getPreOrders);
router.get('/pre-orders', adminController.getPreOrders);
router.put('/preorders/:id/accept', adminController.acceptPreOrder);
router.put('/pre-orders/:id/accept', adminController.acceptPreOrder);
router.put('/preorders/:id/reject', adminController.rejectPreOrder);
router.put('/pre-orders/:id/reject', adminController.rejectPreOrder);
router.put('/preorders/:id/status', adminController.updatePreOrderStatus);
router.put('/pre-orders/:id/status', adminController.updatePreOrderStatus);

// Capacity
router.get('/capacity', adminController.getCapacity);
router.post('/capacity', adminController.setCapacity);
router.put('/capacity/:id', adminController.updateCapacity);
router.delete('/capacity/:id', adminController.deleteCapacity);

// Bulk Orders
router.get('/bulk-orders', adminController.getBulkOrders);
router.put('/bulk-orders/:id/status', adminController.updateBulkOrderStatus);

// Customers
router.get('/customers', adminController.getCustomers);
router.get('/customers/:id', adminController.getCustomer);

// Settings
router.get('/settings', adminController.getSettings);
router.put('/settings', adminController.updateSettings);

// Notifications
router.get('/notifications', adminController.getAdminNotifications);
router.put('/notifications/:id/read', adminController.markAdminNotificationRead);

module.exports = router;
