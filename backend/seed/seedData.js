const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config(); // Fallback
const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Settings = require('../models/Settings');
const connectDB = require('../config/db');

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Settings.deleteMany({});

    console.log('Creating owner...');
    const owner = await User.create({
      name: 'Sri Ram Sweets(Vinay Hotel)',
      phone: '8292734852',
      password: 'vinaychacha@123',
      role: 'owner'
    });
    console.log('Owner created.');

    console.log('Creating settings...');
    await Settings.create({
      restaurantName: 'Sri Ram Sweets(Vinay Hotel)',
      upiId: 'sriramsweets@upi',
      upiName: 'Sri Ram Sweets(Vinay Hotel)',
      address: 'Q2VC+MV6, Hdfc Bank Road, Manpur, Bihar 823003',
      phone: '8292734852',
      deliveryCharge: 30,
      minOrderForFreeDelivery: 500,
      activeFestivals: [
        { name: 'Diwali Special', active: true, description: 'Order your favourite Diwali sweets in advance' },
        { name: 'Holi Special', active: true, description: 'Holi special gujiya and sweets' },
        { name: 'Chhath Special', active: true, description: 'Chhath puja special thekua and sweets' },
        { name: 'Wedding Season', active: true, description: 'Bulk sweets for wedding celebrations' }
      ]
    });
    console.log('Settings created.');

    console.log('Creating categories...');
    const cats = ['Sweets', 'Snacks', 'Namkeen', 'Cakes', 'Beverages', 'Meals', 'Festival Specials'];
    const createdCats = {};
    for (let i = 0; i < cats.length; i++) {
      const c = await Category.create({ name: cats[i], order: i });
      createdCats[cats[i]] = c._id;
    }
    console.log(`Created ${cats.length} categories.`);

    console.log('Creating products...');
    const products = [
      { name: 'Gulab Jamun', price: 400, unit: 'kg', category: createdCats['Sweets'] },
      { name: 'Kaju Katli', price: 800, unit: 'kg', category: createdCats['Sweets'] },
      { name: 'Rasgulla', price: 350, unit: 'kg', category: createdCats['Sweets'] },
      { name: 'Laddu', price: 450, unit: 'kg', category: createdCats['Sweets'] },
      { name: 'Barfi', price: 500, unit: 'kg', category: createdCats['Sweets'] },
      { name: 'Jalebi', price: 300, unit: 'kg', category: createdCats['Sweets'] },
      { name: 'Peda', price: 550, unit: 'kg', category: createdCats['Sweets'] },
      { name: 'Soan Papdi', price: 350, unit: 'kg', category: createdCats['Sweets'] },
      { name: 'Rasmalai', price: 500, unit: 'kg', category: createdCats['Sweets'] },
      { name: 'Cham Cham', price: 400, unit: 'kg', category: createdCats['Sweets'] },

      { name: 'Samosa', price: 15, unit: 'piece', category: createdCats['Snacks'] },
      { name: 'Kachori', price: 20, unit: 'piece', category: createdCats['Snacks'] },
      { name: 'Bread Pakora', price: 20, unit: 'piece', category: createdCats['Snacks'] },
      { name: 'Aloo Tikki', price: 15, unit: 'piece', category: createdCats['Snacks'] },
      { name: 'Paneer Pakora', price: 200, unit: 'plate', category: createdCats['Snacks'] },
      { name: 'Spring Roll', price: 30, unit: 'piece', category: createdCats['Snacks'] },

      { name: 'Mixture', price: 300, unit: 'kg', category: createdCats['Namkeen'] },
      { name: 'Sev', price: 280, unit: 'kg', category: createdCats['Namkeen'] },
      { name: 'Bhujia', price: 320, unit: 'kg', category: createdCats['Namkeen'] },
      { name: 'Moong Dal', price: 350, unit: 'kg', category: createdCats['Namkeen'] },
      { name: 'Aloo Bhujia', price: 300, unit: 'kg', category: createdCats['Namkeen'] },

      { name: 'Vanilla Cake', price: 500, unit: 'kg', category: createdCats['Cakes'] },
      { name: 'Chocolate Cake', price: 600, unit: 'kg', category: createdCats['Cakes'] },
      { name: 'Fruit Cake', price: 650, unit: 'kg', category: createdCats['Cakes'] },
      { name: 'Black Forest', price: 700, unit: 'kg', category: createdCats['Cakes'] },

      { name: 'Lassi', price: 40, unit: 'glass', category: createdCats['Beverages'] },
      { name: 'Chaas', price: 20, unit: 'glass', category: createdCats['Beverages'] },
      { name: 'Badam Milk', price: 60, unit: 'glass', category: createdCats['Beverages'] },
      { name: 'Cold Coffee', price: 80, unit: 'glass', category: createdCats['Beverages'] },

      { name: 'Thali', price: 150, unit: 'plate', category: createdCats['Meals'] },
      { name: 'Puri Sabzi', price: 80, unit: 'plate', category: createdCats['Meals'] },
      { name: 'Chole Bhature', price: 100, unit: 'plate', category: createdCats['Meals'] },

      { name: 'Diwali Special Laddu', price: 500, unit: 'kg', category: createdCats['Festival Specials'], preorderEnabled: true },
      { name: 'Diwali Kaju Katli Box', price: 900, unit: 'kg', category: createdCats['Festival Specials'], preorderEnabled: true },
      { name: 'Holi Gujiya', price: 400, unit: 'kg', category: createdCats['Festival Specials'], preorderEnabled: true },
      { name: 'Special Mithai Box 500g', price: 450, unit: 'box', category: createdCats['Festival Specials'], preorderEnabled: true },
      { name: 'Special Mithai Box 1kg', price: 850, unit: 'box', category: createdCats['Festival Specials'], preorderEnabled: true }
    ];

    await Product.insertMany(products);
    console.log(`Created ${products.length} products.`);

    console.log('Seed completed successfully!');
    process.exit();
  } catch (error) {
    console.error('Error with seed data!', error);
    process.exit(1);
  }
};

seedData();
