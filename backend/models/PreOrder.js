const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: { type: String },
  price: { type: Number },
  quantity: { type: Number },
  unit: { type: String },
  subtotal: { type: Number }
});

const addressSchema = new mongoose.Schema({
  street: { type: String },
  city: { type: String },
  state: { type: String },
  pincode: { type: String }
});

const preOrderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  preOrderNumber: { type: String, unique: true },
  items: [orderItemSchema],
  festival: { type: String, required: true },
  scheduledDate: { type: Date, required: true },
  scheduledTime: { type: String },
  fulfillmentType: { type: String, enum: ['pickup', 'delivery'], required: true },
  deliveryAddress: addressSchema,
  totalAmount: { type: Number, required: true },
  deliveryCharge: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['pending', 'submitted', 'verified', 'failed'], default: 'pending' },
  orderStatus: { 
    type: String, 
    enum: ['placed', 'accepted', 'rejected', 'payment_pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'completed', 'cancelled'], 
    default: 'placed' 
  },
  notes: { type: String },
  rejectionReason: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('PreOrder', preOrderSchema);
