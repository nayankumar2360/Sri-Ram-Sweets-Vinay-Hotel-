const Order = require('../models/Order');
const Product = require('../models/Product');
const Settings = require('../models/Settings');
const Payment = require('../models/Payment');
const User = require('../models/User');
const { generateOrderNumber, createNotification } = require('../utils/helpers');

exports.createOrder = async (req, res, next) => {
  try {
    const { items, fulfillmentType, deliveryAddress, notes } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    let subtotal = 0;
    const orderItems = [];

    for (let item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.product}` });
      }
      
      const itemSubtotal = product.price * item.quantity;
      subtotal += itemSubtotal;
      
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        unit: product.unit,
        subtotal: itemSubtotal
      });
    }

    const settings = await Settings.findOne() || new Settings();
    let deliveryCharge = 0;
    
    if (fulfillmentType === 'delivery') {
      if (!settings.isDeliveryAvailable) {
        return res.status(400).json({ success: false, message: 'Delivery is not available currently' });
      }
      if (subtotal < settings.minOrderForFreeDelivery) {
        deliveryCharge = settings.deliveryCharge;
      }
    }

    const grandTotal = subtotal + deliveryCharge;

    const order = await Order.create({
      orderNumber: generateOrderNumber('ORD'),
      customer: req.user._id,
      items: orderItems,
      totalAmount: subtotal,
      deliveryCharge,
      grandTotal,
      fulfillmentType,
      deliveryAddress,
      notes,
      orderType: 'normal'
    });

    const owners = await User.find({ role: 'owner' });
    for (const owner of owners) {
      await createNotification(
        owner._id,
        'New Order Received',
        `Order ${order.orderNumber} placed for ₹${order.grandTotal}.`,
        'order',
        order._id,
        'order'
      );
    }

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, customer: req.user._id })
      .populate('items.product');
      
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const payment = await Payment.findOne({ order: order._id });

    res.status(200).json({ success: true, data: { ...order.toObject(), payment } });
  } catch (error) {
    next(error);
  }
};

exports.submitPayment = async (req, res, next) => {
  try {
    const { transactionId } = req.body;
    
    if (!transactionId) {
      return res.status(400).json({ success: false, message: 'Transaction ID is required' });
    }

    const order = await Order.findOne({ _id: req.params.id, customer: req.user._id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const screenshotUrl = req.file ? `/uploads/payments/${req.file.filename}` : null;

    const payment = await Payment.create({
      order: order._id,
      orderType: 'order',
      amount: order.grandTotal,
      transactionId,
      screenshot: screenshotUrl,
      status: 'submitted'
    });

    order.paymentStatus = 'submitted';
    await order.save();

    const owners = await User.find({ role: 'owner' });
    for (const owner of owners) {
      await createNotification(
        owner._id,
        'Payment Submitted',
        `Payment submitted for Order ${order.orderNumber}.`,
        'payment',
        order._id,
        'order'
      );
    }

    res.status(200).json({ success: true, data: payment, message: 'Payment submitted successfully' });
  } catch (error) {
    next(error);
  }
};
