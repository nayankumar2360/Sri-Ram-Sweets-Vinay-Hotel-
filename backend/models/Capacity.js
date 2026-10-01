const mongoose = require('mongoose');

const capacitySchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  date: { type: Date, required: true },
  maxCapacity: { type: Number, required: true },
  currentOrdered: { type: Number, default: 0 },
  unlimited: { type: Boolean, default: false }
}, { timestamps: true });

capacitySchema.index({ product: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Capacity', capacitySchema);
