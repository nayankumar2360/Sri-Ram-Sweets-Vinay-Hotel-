const mongoose = require('mongoose');

const bulkOrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: { type: String },
  quantity: { type: Number },
  unit: { type: String }
});

const addressSchema = new mongoose.Schema({
  street: { type: String },
  city: { type: String },
  state: { type: String },
  pincode: { type: String }
});

const bulkOrderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bulkOrderNumber: { type: String, unique: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  eventType: { 
    type: String, 
    enum: ['wedding', 'birthday', 'school_function', 'office_event', 'family_function', 'religious_event', 'festival', 'other'], 
    required: true 
  },
  eventDate: { type: Date, required: true },
  requiredTime: { type: String },
  guestCount: { type: Number },
  items: [bulkOrderItemSchema],
  requirements: { type: String },
  estimatedBudget: { type: Number },
  quotedAmount: { type: Number },
  fulfillmentType: { type: String, enum: ['pickup', 'delivery'], required: true },
  deliveryAddress: addressSchema,
  status: { 
    type: String, 
    enum: ['requested', 'contacted', 'quotation', 'accepted', 'payment_pending', 'paid', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'], 
    default: 'requested' 
  },
  notes: { type: String },
  ownerNotes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('BulkOrder', bulkOrderSchema);
