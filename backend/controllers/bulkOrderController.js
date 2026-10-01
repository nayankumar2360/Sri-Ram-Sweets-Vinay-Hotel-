const BulkOrder = require('../models/BulkOrder');
const Product = require('../models/Product');
const User = require('../models/User');
const { generateOrderNumber, createNotification } = require('../utils/helpers');

exports.createBulkOrder = async (req, res, next) => {
  try {
    const { 
      customerName, customerPhone, eventType, eventDate, 
      requiredTime, guestCount, items, requirements, 
      estimatedBudget, fulfillmentType, deliveryAddress 
    } = req.body;

    const populatedItems = [];
    if (items && items.length > 0) {
      for (const item of items) {
        const product = await Product.findById(item.product);
        if (product) {
          populatedItems.push({
            product: product._id,
            name: product.name,
            quantity: item.quantity,
            unit: product.unit
          });
        }
      }
    }

    const finalName = customerName || req.user?.name || 'Valued Customer';
    const finalPhone = customerPhone || req.user?.phone || '';
    const finalGuests = guestCount || req.body.numberOfGuests || 0;
    const finalTime = requiredTime || req.body.eventTime || '';
    const finalEventType = (eventType || 'other').toLowerCase().replace(/\s+/g, '_');

    const bulkOrder = await BulkOrder.create({
      bulkOrderNumber: generateOrderNumber('BLK'),
      customer: req.user._id,
      customerName: finalName,
      customerPhone: finalPhone,
      eventType: finalEventType,
      eventDate,
      requiredTime: finalTime,
      guestCount: finalGuests,
      items: populatedItems,
      requirements,
      estimatedBudget,
      fulfillmentType: fulfillmentType || 'pickup',
      deliveryAddress
    });

    const owners = await User.find({ role: 'owner' });
    for (const owner of owners) {
      await createNotification(
        owner._id,
        'New Bulk Order Request',
        `Bulk Order request ${bulkOrder.bulkOrderNumber} received for ${eventType}.`,
        'bulk',
        bulkOrder._id,
        'bulk'
      );
    }

    res.status(201).json({ success: true, data: bulkOrder });
  } catch (error) {
    next(error);
  }
};

exports.getBulkOrders = async (req, res, next) => {
  try {
    const bulkOrders = await BulkOrder.find({ customer: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: bulkOrders });
  } catch (error) {
    next(error);
  }
};

exports.getBulkOrder = async (req, res, next) => {
  try {
    const bulkOrder = await BulkOrder.findOne({ _id: req.params.id, customer: req.user._id }).populate('items.product');
    if (!bulkOrder) return res.status(404).json({ success: false, message: 'Bulk order not found' });
    res.status(200).json({ success: true, data: bulkOrder });
  } catch (error) {
    next(error);
  }
};
