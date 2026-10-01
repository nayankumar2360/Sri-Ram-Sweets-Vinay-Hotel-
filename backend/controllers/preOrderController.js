const PreOrder = require('../models/PreOrder');
const Product = require('../models/Product');
const Settings = require('../models/Settings');
const Capacity = require('../models/Capacity');
const Payment = require('../models/Payment');
const User = require('../models/User');
const { generateOrderNumber, createNotification } = require('../utils/helpers');

exports.createPreOrder = async (req, res, next) => {
  try {
    const { items, festival, scheduledDate, scheduledTime, fulfillmentType, deliveryAddress, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in pre-order' });
    }

    const targetDate = new Date(scheduledDate);
    targetDate.setHours(0, 0, 0, 0);

    let subtotal = 0;
    const orderItems = [];

    // Capacity check loop
    for (let item of items) {
      const product = await Product.findById(item.product);
      if (!product || !product.preorderEnabled) {
        return res.status(400).json({ success: false, message: `Product not available for pre-order: ${item.product}` });
      }

      const capacity = await Capacity.findOne({ product: product._id, date: targetDate });
      
      if (capacity && !capacity.unlimited) {
        if (capacity.currentOrdered + item.quantity > capacity.maxCapacity) {
          const remaining = capacity.maxCapacity - capacity.currentOrdered;
          return res.status(400).json({ 
            success: false, 
            message: `Capacity exceeded for ${product.name}. Remaining: ${remaining}` 
          });
        }
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

    // Decrement capacities
    for (let item of items) {
      const capacity = await Capacity.findOne({ product: item.product, date: targetDate });
      if (capacity && !capacity.unlimited) {
        capacity.currentOrdered += item.quantity;
        await capacity.save();
      }
    }

    const settings = await Settings.findOne() || new Settings();
    let deliveryCharge = 0;
    
    if (fulfillmentType === 'delivery') {
      if (subtotal < settings.minOrderForFreeDelivery) {
        deliveryCharge = settings.deliveryCharge;
      }
    }

    const grandTotal = subtotal + deliveryCharge;

    const preOrder = await PreOrder.create({
      preOrderNumber: generateOrderNumber('PRE'),
      customer: req.user._id,
      items: orderItems,
      festival,
      scheduledDate: targetDate,
      scheduledTime,
      totalAmount: subtotal,
      deliveryCharge,
      grandTotal,
      fulfillmentType,
      deliveryAddress,
      notes
    });

    const owners = await User.find({ role: 'owner' });
    for (const owner of owners) {
      await createNotification(
        owner._id,
        'New Pre-Order Received',
        `Pre-Order ${preOrder.preOrderNumber} placed for ${festival}.`,
        'preorder',
        preOrder._id,
        'preorder'
      );
    }

    res.status(201).json({ success: true, data: preOrder });
  } catch (error) {
    next(error);
  }
};

exports.getPreOrders = async (req, res, next) => {
  try {
    const preOrders = await PreOrder.find({ customer: req.user._id })
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: preOrders });
  } catch (error) {
    next(error);
  }
};

exports.getPreOrder = async (req, res, next) => {
  try {
    const preOrder = await PreOrder.findOne({ _id: req.params.id, customer: req.user._id })
      .populate('items.product');
      
    if (!preOrder) {
      return res.status(404).json({ success: false, message: 'Pre-order not found' });
    }

    res.status(200).json({ success: true, data: preOrder });
  } catch (error) {
    next(error);
  }
};

exports.checkCapacity = async (req, res, next) => {
  try {
    const { productId, date, quantity } = req.query;
    if (!date) {
      return res.status(200).json({ success: true, data: { available: true, isFull: false } });
    }

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    if (productId) {
      const capacity = await Capacity.findOne({ product: productId, date: targetDate });
      if (!capacity || capacity.unlimited) {
        return res.status(200).json({ success: true, data: { available: true, isFull: false, unlimited: true } });
      }
      const remaining = Math.max(0, capacity.maxCapacity - capacity.currentOrdered);
      const requestedQty = quantity ? Number(quantity) : 1;
      const available = remaining >= requestedQty;
      return res.status(200).json({ 
        success: true, 
        data: { available, isFull: remaining <= 0, maxCapacity: capacity.maxCapacity, currentOrdered: capacity.currentOrdered, remaining } 
      });
    }

    // General date capacity check
    const capacities = await Capacity.find({ date: targetDate });
    const fullItems = capacities.filter(c => !c.unlimited && c.currentOrdered >= c.maxCapacity);
    const isFull = capacities.length > 0 && fullItems.length === capacities.length;

    res.status(200).json({ 
      success: true, 
      data: { available: !isFull, isFull } 
    });
  } catch (error) {
    next(error);
  }
};

exports.getFestivals = async (req, res, next) => {
  try {
    const settings = await Settings.findOne();
    const activeFestivals = settings ? settings.activeFestivals.filter(f => f.active) : [];
    res.status(200).json({ success: true, data: activeFestivals });
  } catch (error) {
    next(error);
  }
};

exports.submitPayment = async (req, res, next) => {
  try {
    const { transactionId } = req.body;
    if (!transactionId) {
      return res.status(400).json({ success: false, message: 'Transaction ID required' });
    }

    const preOrder = await PreOrder.findOne({ _id: req.params.id, customer: req.user._id });
    if (!preOrder) return res.status(404).json({ success: false, message: 'Pre-order not found' });

    const screenshotUrl = req.file ? `/uploads/payments/${req.file.filename}` : null;

    const payment = await Payment.create({
      order: preOrder._id,
      orderType: 'preorder',
      amount: preOrder.grandTotal,
      transactionId,
      screenshot: screenshotUrl,
      status: 'submitted'
    });

    preOrder.paymentStatus = 'submitted';
    await preOrder.save();

    const owners = await User.find({ role: 'owner' });
    for (const owner of owners) {
      await createNotification(
        owner._id,
        'Pre-Order Payment Submitted',
        `Payment submitted for Pre-Order ${preOrder.preOrderNumber}.`,
        'payment',
        preOrder._id,
        'preorder'
      );
    }

    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};
