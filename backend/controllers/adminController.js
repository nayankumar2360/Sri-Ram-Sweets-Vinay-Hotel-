const Order = require('../models/Order');
const PreOrder = require('../models/PreOrder');
const BulkOrder = require('../models/BulkOrder');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Payment = require('../models/Payment');
const User = require('../models/User');
const Capacity = require('../models/Capacity');
const Settings = require('../models/Settings');
const Notification = require('../models/Notification');
const { createNotification } = require('../utils/helpers');

// --- DASHBOARD ---
exports.getDashboard = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      todayOrders, pendingOrders, totalPreOrders, totalBulkOrders, 
      completedToday, pendingPayments, todayRevenue, totalRevenue
    ] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: today } }),
      Order.countDocuments({ orderStatus: { $in: ['placed', 'preparing', 'ready'] } }),
      PreOrder.countDocuments({}),
      BulkOrder.countDocuments({}),
      Order.countDocuments({ orderStatus: 'completed', updatedAt: { $gte: today } }),
      Payment.countDocuments({ status: 'submitted' }),
      Order.aggregate([
        { $match: { createdAt: { $gte: today }, paymentStatus: 'verified' } },
        { $group: { _id: null, total: { $sum: '$grandTotal' } } }
      ]),
      Order.aggregate([
        { $match: { paymentStatus: 'verified' } },
        { $group: { _id: null, total: { $sum: '$grandTotal' } } }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        todayOrders,
        pendingOrders,
        totalPreOrders,
        totalBulkOrders,
        completedToday,
        pendingPayments,
        todayRevenue: todayRevenue.length > 0 ? todayRevenue[0].total : 0,
        totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0
      }
    });
  } catch (error) { next(error); }
};

// --- PRODUCTS ---
exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().populate('category');
    res.status(200).json({ success: true, data: products });
  } catch (error) { next(error); }
};

exports.createProduct = async (req, res, next) => {
  try {
    const productData = { ...req.body };
    if (productData.isAvailable !== undefined && productData.available === undefined) {
      productData.available = productData.isAvailable === 'true' || productData.isAvailable === true;
    }
    if (productData.isVegetarian !== undefined && productData.vegetarian === undefined) {
      productData.vegetarian = productData.isVegetarian === 'true' || productData.isVegetarian === true;
    }
    if (productData.minQuantity !== undefined && productData.minimumQuantity === undefined) {
      productData.minimumQuantity = Number(productData.minQuantity);
    }
    if (req.file) {
      productData.image = `/uploads/products/${req.file.filename}`;
    }
    const product = await Product.create(productData);
    res.status(201).json({ success: true, data: product });
  } catch (error) { next(error); }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const productData = { ...req.body };
    if (productData.isAvailable !== undefined && productData.available === undefined) {
      productData.available = productData.isAvailable === 'true' || productData.isAvailable === true;
    }
    if (productData.isVegetarian !== undefined && productData.vegetarian === undefined) {
      productData.vegetarian = productData.isVegetarian === 'true' || productData.isVegetarian === true;
    }
    if (productData.minQuantity !== undefined && productData.minimumQuantity === undefined) {
      productData.minimumQuantity = Number(productData.minQuantity);
    }
    if (req.file) {
      productData.image = `/uploads/products/${req.file.filename}`;
    }
    const product = await Product.findByIdAndUpdate(req.params.id, productData, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, data: product });
  } catch (error) { next(error); }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};

exports.toggleAvailability = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { available: req.body.available }, { new: true });
    res.status(200).json({ success: true, data: product });
  } catch (error) { next(error); }
};

// --- CATEGORIES ---
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ success: true, data: categories });
  } catch (error) { next(error); }
};

exports.createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) { next(error); }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: category });
  } catch (error) { next(error); }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const productsCount = await Product.countDocuments({ category: req.params.id });
    if (productsCount > 0) {
      return res.status(400).json({ success: false, message: 'Cannot delete category with products' });
    }
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};

// --- ORDERS ---
exports.getOrders = async (req, res, next) => {
  try {
    const { status, type, page = 1, limit = 50 } = req.query;
    const query = {};
    if (status) query.orderStatus = status;
    if (type) query.orderType = type;

    const orders = await Order.find(query)
      .populate('customer', 'name phone email')
      .populate('items.product')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.status(200).json({ success: true, data: orders });
  } catch (error) { next(error); }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name phone email')
      .populate('items.product');
    res.status(200).json({ success: true, data: order });
  } catch (error) { next(error); }
};

exports.acceptOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus: 'accepted', paymentStatus: 'pending' }, { new: true });
    await createNotification(order.customer, 'Order Accepted', `Your order ${order.orderNumber} has been accepted.`, 'order', order._id, 'order');
    res.status(200).json({ success: true, data: order });
  } catch (error) { next(error); }
};

exports.rejectOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus: 'rejected', rejectionReason: req.body.reason }, { new: true });
    await createNotification(order.customer, 'Order Rejected', `Your order ${order.orderNumber} was rejected. Reason: ${req.body.reason}`, 'order', order._id, 'order');
    res.status(200).json({ success: true, data: order });
  } catch (error) { next(error); }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus: req.body.status }, { new: true });
    await createNotification(order.customer, 'Order Status Updated', `Order ${order.orderNumber} is now ${req.body.status}.`, 'order', order._id, 'order');
    res.status(200).json({ success: true, data: order });
  } catch (error) { next(error); }
};

// --- PAYMENTS ---
exports.getPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find(req.query.status ? { status: req.query.status } : {}).populate('order');
    res.status(200).json({ success: true, data: payments });
  } catch (error) { next(error); }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    let payment = await Payment.findById(req.params.id);
    if (!payment) {
      payment = await Payment.findOne({ order: req.params.id });
    }
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    
    payment.status = 'verified';
    payment.verifiedBy = req.user._id;
    payment.verifiedAt = new Date();
    await payment.save();

    const OrderModel = payment.orderType === 'preorder' ? PreOrder : Order;
    const order = await OrderModel.findById(payment.order);
    if (order) {
      order.paymentStatus = 'verified';
      order.orderStatus = 'confirmed';
      await order.save();
      const num = order.orderNumber || order.preOrderNumber;
      await createNotification(order.customer, 'Payment Verified', `Payment for ${num} verified.`, 'payment', order._id, payment.orderType);
    }

    res.status(200).json({ success: true, data: payment });
  } catch (error) { next(error); }
};

exports.rejectPayment = async (req, res, next) => {
  try {
    let payment = await Payment.findById(req.params.id);
    if (!payment) {
      payment = await Payment.findOne({ order: req.params.id });
    }
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });

    payment.status = 'failed';
    payment.rejectionReason = req.body?.reason || req.body?.rejectionReason || 'Payment could not be verified';
    await payment.save();

    const OrderModel = payment.orderType === 'preorder' ? PreOrder : Order;
    const order = await OrderModel.findById(payment.order);
    if (order) {
      order.paymentStatus = 'failed';
      await order.save();
      const num = order.orderNumber || order.preOrderNumber;
      await createNotification(order.customer, 'Payment Failed', `Payment for ${num} failed. Reason: ${payment.rejectionReason}`, 'payment', order._id, payment.orderType);
    }
    res.status(200).json({ success: true, data: payment });
  } catch (error) { next(error); }
};

// --- PREORDERS ---
exports.getPreOrders = async (req, res, next) => {
  try {
    const preorders = await PreOrder.find().populate('customer', 'name phone email').populate('items.product');
    res.status(200).json({ success: true, data: preorders });
  } catch (error) { next(error); }
};

exports.acceptPreOrder = async (req, res, next) => {
  try {
    const preOrder = await PreOrder.findByIdAndUpdate(req.params.id, { orderStatus: 'accepted' }, { new: true });
    await createNotification(preOrder.customer, 'Pre-Order Accepted', `Pre-Order ${preOrder.preOrderNumber} accepted.`, 'preorder', preOrder._id, 'preorder');
    res.status(200).json({ success: true, data: preOrder });
  } catch (error) { next(error); }
};

exports.rejectPreOrder = async (req, res, next) => {
  try {
    const preOrder = await PreOrder.findByIdAndUpdate(req.params.id, { orderStatus: 'rejected', rejectionReason: req.body.reason }, { new: true });
    
    // Restore capacity
    const targetDate = new Date(preOrder.scheduledDate);
    targetDate.setHours(0, 0, 0, 0);
    for (const item of preOrder.items) {
      const capacity = await Capacity.findOne({ product: item.product, date: targetDate });
      if (capacity && !capacity.unlimited) {
        capacity.currentOrdered -= item.quantity;
        await capacity.save();
      }
    }

    await createNotification(preOrder.customer, 'Pre-Order Rejected', `Pre-Order ${preOrder.preOrderNumber} rejected.`, 'preorder', preOrder._id, 'preorder');
    res.status(200).json({ success: true, data: preOrder });
  } catch (error) { next(error); }
};

exports.updatePreOrderStatus = async (req, res, next) => {
  try {
    const preOrder = await PreOrder.findByIdAndUpdate(req.params.id, { orderStatus: req.body.status }, { new: true });
    res.status(200).json({ success: true, data: preOrder });
  } catch (error) { next(error); }
};

// --- CAPACITY ---
exports.getCapacity = async (req, res, next) => {
  try {
    const capacity = await Capacity.find().populate('product');
    res.status(200).json({ success: true, data: capacity });
  } catch (error) { next(error); }
};

exports.setCapacity = async (req, res, next) => {
  try {
    const { product, date, maxCapacity, unlimited } = req.body;
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const capacity = await Capacity.findOneAndUpdate(
      { product, date: targetDate },
      { 
        product, 
        date: targetDate, 
        maxCapacity: unlimited ? -1 : Number(maxCapacity), 
        unlimited: !!unlimited 
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).populate('product');

    res.status(201).json({ success: true, data: capacity });
  } catch (error) { next(error); }
};

exports.updateCapacity = async (req, res, next) => {
  try {
    const capacity = await Capacity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: capacity });
  } catch (error) { next(error); }
};

exports.deleteCapacity = async (req, res, next) => {
  try {
    await Capacity.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};

// --- BULK ORDERS ---
exports.getBulkOrders = async (req, res, next) => {
  try {
    const bulkOrders = await BulkOrder.find().populate('customer', 'name phone email');
    res.status(200).json({ success: true, data: bulkOrders });
  } catch (error) { next(error); }
};

exports.updateBulkOrderStatus = async (req, res, next) => {
  try {
    const { status, quotedAmount, ownerNotes } = req.body;
    const bulkOrder = await BulkOrder.findByIdAndUpdate(req.params.id, { status, quotedAmount, ownerNotes }, { new: true });
    await createNotification(bulkOrder.customer, 'Bulk Order Update', `Your bulk order ${bulkOrder.bulkOrderNumber} status is now ${status}.`, 'bulk', bulkOrder._id, 'bulk');
    res.status(200).json({ success: true, data: bulkOrder });
  } catch (error) { next(error); }
};

// --- CUSTOMERS ---
exports.getCustomers = async (req, res, next) => {
  try {
    const customers = await User.find({ role: 'customer' }).select('name phone email createdAt');
    const enriched = await Promise.all(customers.map(async c => {
      const orderCount = await Order.countDocuments({ customer: c._id });
      return { ...c.toObject(), orderCount };
    }));
    res.status(200).json({ success: true, data: enriched });
  } catch (error) { next(error); }
};

exports.getCustomer = async (req, res, next) => {
  try {
    const customer = await User.findById(req.params.id).select('-password');
    const orders = await Order.find({ customer: req.params.id });
    res.status(200).json({ success: true, data: { customer, orders } });
  } catch (error) { next(error); }
};

// --- ANALYTICS ---
exports.getAnalytics = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const completedOrders = await Order.countDocuments({ orderStatus: 'completed' });
    const agg = await Order.aggregate([ { $match: { paymentStatus: 'verified' } }, { $group: { _id: null, total: { $sum: '$grandTotal' } } } ]);
    const totalRevenue = agg.length ? agg[0].total : 0;
    const averageOrderValue = completedOrders ? (totalRevenue / completedOrders) : 0;
    res.status(200).json({ success: true, data: { totalOrders, completedOrders, totalRevenue, averageOrderValue } });
  } catch (error) { next(error); }
};

exports.getFestivalAnalytics = async (req, res, next) => {
  try {
    const stats = await PreOrder.aggregate([
      { $unwind: "$items" },
      { $group: { _id: { festival: "$festival", product: "$items.name" }, totalQuantity: { $sum: "$items.quantity" } } }
    ]);
    res.status(200).json({ success: true, data: stats });
  } catch (error) { next(error); }
};

exports.getProductAnalytics = async (req, res, next) => {
  try {
    const stats = await Order.aggregate([
      { $unwind: "$items" },
      { $group: { _id: "$items.name", totalQuantity: { $sum: "$items.quantity" }, totalRevenue: { $sum: "$items.subtotal" } } },
      { $sort: { totalQuantity: -1 } }
    ]);
    res.status(200).json({ success: true, data: stats });
  } catch (error) { next(error); }
};

// --- SETTINGS ---
exports.getSettings = async (req, res, next) => {
  try {
    const settings = await Settings.findOne() || new Settings();
    res.status(200).json({ success: true, data: settings });
  } catch (error) { next(error); }
};

exports.updateSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();
    Object.assign(settings, req.body);
    await settings.save();
    res.status(200).json({ success: true, data: settings });
  } catch (error) { next(error); }
};

// --- NOTIFICATIONS ---
exports.getAdminNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: notifications });
  } catch (error) { next(error); }
};

exports.markAdminNotificationRead = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.status(200).json({ success: true, data: notification });
  } catch (error) { next(error); }
};
