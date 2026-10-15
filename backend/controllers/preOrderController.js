const PreOrder = require('../models/PreOrder');
const Product = require('../models/Product');
const Settings = require('../models/Settings');
const Festival = require('../models/Festival');
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

    let festivalDoc = null;
    let festivalName = festival || 'Festival Special';

    // 1. Check against new Festival model first
    if (festival) {
      if (festival.match(/^[0-9a-fA-F]{24}$/)) {
        festivalDoc = await Festival.findById(festival);
      }
      if (!festivalDoc) {
        festivalDoc = await Festival.findOne({ slug: festival.toLowerCase().trim() });
      }
      if (!festivalDoc) {
        festivalDoc = await Festival.findOne({ name: { $regex: new RegExp(`^${festival}$`, 'i') } });
      }

      if (festivalDoc) {
        festivalName = festivalDoc.name;
        const now = new Date();
        const calculated = festivalDoc.calculateStatus(now);

        if (!calculated.isOrderingAllowed) {
          let errorMsg = `Pre-orders for ${festivalDoc.name} are currently closed.`;
          if (calculated.preorderStatus === 'not_yet_open') {
            errorMsg = `Pre-orders for ${festivalDoc.name} are not open yet. They open on ${calculated.openTime.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}.`;
          } else if (calculated.preorderStatus === 'temporarily_closed') {
            errorMsg = `Pre-orders for ${festivalDoc.name} are temporarily paused by owner. ${calculated.statusReason || ''}`.trim();
          } else if (calculated.preorderStatus === 'sold_out') {
            errorMsg = `Pre-orders for ${festivalDoc.name} have reached full capacity / sold out.`;
          } else if (calculated.preorderStatus === 'deadline_passed') {
            errorMsg = `The pre-order deadline for ${festivalDoc.name} has passed.`;
          } else if (calculated.preorderStatus === 'festival_completed') {
            errorMsg = `${festivalDoc.name} has concluded.`;
          }
          return res.status(400).json({
            success: false,
            message: errorMsg,
            preorderStatus: calculated.preorderStatus,
            statusReason: calculated.statusReason
          });
        }
      } else {
        // Fallback to legacy Settings.activeFestivals check
        const settings = await Settings.findOne() || new Settings();
        const preOrderStartDays = settings.preOrderStartDays || 5;
        const matchFest = settings.activeFestivals?.find(
          f => f.name?.toLowerCase() === festival?.toLowerCase() || f._id?.toString() === festival?.toString()
        );
        if (matchFest && matchFest.startDate && !matchFest.active) {
          const festStart = new Date(matchFest.startDate);
          festStart.setHours(0, 0, 0, 0);
          const windowOpen = new Date(festStart);
          windowOpen.setDate(windowOpen.getDate() - preOrderStartDays);
          windowOpen.setHours(0, 0, 0, 0);

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          if (today < windowOpen) {
            return res.status(400).json({
              success: false,
              message: `Pre-orders for ${matchFest.name} open ${preOrderStartDays} days before the festival on ${windowOpen.toLocaleDateString('en-IN')}.`
            });
          }
        }
      }
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
      festival: festivalName,
      festivalRef: festivalDoc ? festivalDoc._id : null,
      scheduledDate: targetDate,
      scheduledTime,
      totalAmount: subtotal,
      deliveryCharge,
      grandTotal,
      fulfillmentType,
      deliveryAddress,
      notes
    });

    if (festivalDoc) {
      await Festival.findByIdAndUpdate(festivalDoc._id, {
        $inc: { 'preorderSettings.currentTotalOrders': 1 }
      });
    }

    const owners = await User.find({ role: 'owner' });
    for (const owner of owners) {
      await createNotification(
        owner._id,
        'New Pre-Order Received',
        `Pre-Order ${preOrder.preOrderNumber} placed for ${festivalName}.`,
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
    const now = new Date();

    // 1. Query new Festival collection first
    const festivalsFromDb = await Festival.find({ isActive: true })
      .populate('products')
      .sort({ startDate: 1 });

    if (festivalsFromDb && festivalsFromDb.length > 0) {
      const festivalsWithStatus = festivalsFromDb.map(f => {
        const calculated = f.calculateStatus(now);
        return {
          _id: f._id,
          name: f.name,
          slug: f.slug,
          description: f.description,
          region: f.region,
          year: f.year,
          startDate: f.startDate,
          endDate: f.endDate,
          importantDays: f.importantDays || [],
          banner: f.banner,
          preorderSettings: f.preorderSettings,
          manualOverride: f.manualOverride,
          products: f.products,
          isFeatured: f.isFeatured,
          isActive: f.isActive,
          active: calculated.isOrderingAllowed, // backwards compatibility
          isPreOrderOpen: calculated.isOrderingAllowed,
          isOngoing: calculated.festivalStatus === 'ongoing',
          festivalStatus: calculated.festivalStatus,
          preorderStatus: calculated.preorderStatus,
          statusReason: calculated.statusReason,
          preOrderOpensOn: calculated.openTime,
          closeDeadline: calculated.closeDeadline,
          daysUntilFestival: calculated.daysUntilFestival,
          daysUntilPreOrder: calculated.daysUntilPreOrder,
          preOrderStartDays: f.preorderSettings?.leadTimeDays || 5
        };
      }).filter(f => {
        // Show festivals that are currently open for pre-order, ongoing, or upcoming
        if (f.isPreOrderOpen) return true;
        if (f.festivalStatus !== 'completed') return true;
        return false;
      }).sort((a, b) => {
        // Put currently open pre-orders first, then by earliest festival date
        if (a.isPreOrderOpen && !b.isPreOrderOpen) return -1;
        if (!a.isPreOrderOpen && b.isPreOrderOpen) return 1;
        if (a.startDate && b.startDate) return new Date(a.startDate) - new Date(b.startDate);
        return 0;
      });

      return res.status(200).json({ success: true, data: festivalsWithStatus });
    }

    // 2. Fallback to legacy Settings.activeFestivals if Festival collection is not yet seeded
    const settings = await Settings.findOne();
    const preOrderStartDays = settings?.preOrderStartDays || 5;
    const allFestivals = settings?.activeFestivals || [];
    
    now.setHours(0, 0, 0, 0);
    
    const festivalsWithStatus = allFestivals.map(f => {
      let start = null;
      let end = null;
      let preOrderOpensOn = null;
      let daysUntilFestival = null;
      let daysUntilPreOrder = 0;
      let isPreOrderOpen = false;
      let isOngoing = false;

      if (f.startDate) {
        start = new Date(f.startDate);
        start.setHours(0, 0, 0, 0);
        end = f.endDate ? new Date(f.endDate) : new Date(start);
        end.setHours(23, 59, 59, 999);

        preOrderOpensOn = new Date(start);
        preOrderOpensOn.setDate(preOrderOpensOn.getDate() - preOrderStartDays);
        preOrderOpensOn.setHours(0, 0, 0, 0);

        const diffStart = start.getTime() - now.getTime();
        daysUntilFestival = Math.ceil(diffStart / (1000 * 60 * 60 * 24));

        const diffPreOrder = preOrderOpensOn.getTime() - now.getTime();
        daysUntilPreOrder = Math.ceil(diffPreOrder / (1000 * 60 * 60 * 24));

        isOngoing = (now >= start && now <= end);
        isPreOrderOpen = !!f.active || (now >= preOrderOpensOn && now <= end);
      } else {
        isPreOrderOpen = !!f.active;
      }

      return {
        _id: f._id,
        name: f.name,
        description: f.description,
        startDate: f.startDate,
        endDate: f.endDate,
        active: f.active,
        isPreOrderOpen,
        isOngoing,
        preOrderOpensOn,
        daysUntilFestival,
        daysUntilPreOrder: Math.max(0, daysUntilPreOrder),
        preOrderStartDays
      };
    }).filter(f => {
      if (f.isPreOrderOpen) return true;
      if (f.startDate && new Date(f.startDate) >= now) return true;
      return false;
    }).sort((a, b) => {
      if (a.isPreOrderOpen && !b.isPreOrderOpen) return -1;
      if (!a.isPreOrderOpen && b.isPreOrderOpen) return 1;
      if (a.startDate && b.startDate) return new Date(a.startDate) - new Date(b.startDate);
      return 0;
    });
    
    res.status(200).json({ success: true, data: festivalsWithStatus });
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
