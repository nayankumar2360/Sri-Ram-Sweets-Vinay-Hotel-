const mongoose = require('mongoose');

const festivalSchema = new mongoose.Schema({
  name: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  description: { type: String },
  active: { type: Boolean }
});

const settingsSchema = new mongoose.Schema({
  restaurantName: { type: String, default: 'Shri Ram Misthan Bhandar' },
  phone: { type: String },
  email: { type: String },
  address: { type: String },
  upiId: { type: String },
  upiName: { type: String, default: 'Shri Ram Misthan Bhandar' },
  deliveryCharge: { type: Number, default: 30 },
  minOrderForFreeDelivery: { type: Number, default: 500 },
  isDeliveryAvailable: { type: Boolean, default: true },
  openingTime: { type: String, default: '08:00' },
  closingTime: { type: String, default: '21:00' },
  activeFestivals: [festivalSchema]
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
