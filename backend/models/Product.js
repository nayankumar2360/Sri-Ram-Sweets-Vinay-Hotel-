const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  unit: { 
    type: String, 
    enum: ['kg', 'piece', 'plate', 'glass', 'box', 'dozen', 'half_kg', '250g'], 
    required: true 
  },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  image: { type: String },
  available: { type: Boolean, default: true },
  vegetarian: { type: Boolean, default: true },
  preorderEnabled: { type: Boolean, default: false },
  minimumQuantity: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
