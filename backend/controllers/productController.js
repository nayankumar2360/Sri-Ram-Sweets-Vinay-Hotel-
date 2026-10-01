const Product = require('../models/Product');
const Category = require('../models/Category');
const Settings = require('../models/Settings');

exports.getProducts = async (req, res, next) => {
  try {
    const { category, search, available, preorder } = req.query;
    
    let query = {};
    
    if (available === 'true') {
      query.available = true;
    }
    
    if (preorder === 'true') {
      query.preorderEnabled = true;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query).populate('category');
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ active: true }).sort('order');
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

exports.getPublicSettings = async (req, res, next) => {
  try {
    const settings = await Settings.findOne() || new Settings();
    const publicSettings = {
      restaurantName: settings.restaurantName,
      deliveryCharge: settings.deliveryCharge,
      minOrderForFreeDelivery: settings.minOrderForFreeDelivery,
      isDeliveryAvailable: settings.isDeliveryAvailable,
      activeFestivals: settings.activeFestivals,
      openingTime: settings.openingTime,
      closingTime: settings.closingTime,
      upiId: settings.upiId,
      upiName: settings.upiName,
      address: settings.address || 'Q2VC+MV6, Hdfc Bank Road, Manpur, Bihar 823003',
      phone: settings.phone || '8292734852'
    };
    res.status(200).json({ success: true, data: publicSettings });
  } catch (error) {
    next(error);
  }
};
