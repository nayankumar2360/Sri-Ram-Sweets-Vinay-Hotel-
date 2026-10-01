const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, required: true },
  orderType: { type: String, enum: ['order', 'preorder'], required: true },
  amount: { type: Number, required: true },
  method: { type: String, default: 'upi' },
  transactionId: { type: String },
  screenshot: { type: String }, // file path
  status: { type: String, enum: ['pending', 'submitted', 'verified', 'failed'], default: 'pending' },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verifiedAt: { type: Date },
  rejectionReason: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
