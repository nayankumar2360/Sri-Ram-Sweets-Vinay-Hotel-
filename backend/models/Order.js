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

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  orderType: { type: String, enum: ['normal', 'preorder', 'bulk'], default: 'normal' },
  totalAmount: { type: Number, required: true },
  deliveryCharge: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },
  fulfillmentType: { type: String, enum: ['pickup', 'delivery'], required: true },
  deliveryAddress: addressSchema,
  paymentStatus: { type: String, enum: ['pending', 'submitted', 'verified', 'failed'], default: 'pending' },
  orderStatus: { 
    type: String, 
    enum: ['placed', 'accepted', 'rejected', 'payment_pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'completed', 'cancelled'], 
    default: 'placed' 
  },
  scheduledDate: { type: Date },
  scheduledTime: { type: String },
  festival: { type: String },
  notes: { type: String },
  rejectionReason: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
