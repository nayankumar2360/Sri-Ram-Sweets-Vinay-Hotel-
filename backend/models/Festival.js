const mongoose = require('mongoose');

const importantDaySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  description: { type: String, trim: true }
}, { _id: true });

const bannerSchema = new mongoose.Schema({
  desktopImage: { type: String, default: '' },
  mobileImage: { type: String, default: '' },
  headline: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  ctaText: { type: String, default: 'Pre-Order Now' },
  ctaLink: { type: String, default: '/pre-order' },
  overlayOpacity: { type: Number, default: 0.45, min: 0, max: 1 },
  focalPoint: { type: String, default: 'center' }, // e.g. 'center', 'top', 'bottom'
  enabled: { type: Boolean, default: true },
  displayStartDate: { type: Date },
  displayEndDate: { type: Date }
}, { _id: false });

const preorderSettingsSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: true },
  leadTimeDays: { type: Number, default: 5, min: 0 },
  customOpenDate: { type: Date },
  customCloseDeadline: { type: Date },
  maxTotalOrders: { type: Number, default: 0 }, // 0 = unlimited
  currentTotalOrders: { type: Number, default: 0 }
}, { _id: false });

const manualOverrideSchema = new mongoose.Schema({
  status: { 
    type: String, 
    enum: ['auto', 'open', 'closed'], 
    default: 'auto' 
  },
  reason: { type: String, default: '' },
  updatedAt: { type: Date },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { _id: false });

const festivalSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Festival name is required'], 
    trim: true 
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true, 
    lowercase: true,
    index: true 
  },
  description: { type: String, trim: true, default: '' },
  region: { 
    type: String, 
    trim: true, 
    default: 'Bihar', 
    enum: ['Bihar', 'Pan-India', 'Eastern India', 'National', 'Other'] 
  },
  year: { type: Number, required: true, index: true },
  startDate: { type: Date, required: [true, 'Start date is required'], index: true },
  endDate: { type: Date, required: [true, 'End date is required'], index: true },
  importantDays: [importantDaySchema],
  banner: { type: bannerSchema, default: () => ({}) },
  preorderSettings: { type: preorderSettingsSchema, default: () => ({}) },
  manualOverride: { type: manualOverrideSchema, default: () => ({ status: 'auto' }) },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, { 
  timestamps: true 
});

// Helper method on schema to compute dynamic preorder and festival status
festivalSchema.methods.calculateStatus = function (now = new Date()) {
  const currentTime = new Date(now).getTime();

  const start = new Date(this.startDate).getTime();
  const end = new Date(this.endDate).getTime();

  // Determine festival timeline status
  let festivalStatus = 'upcoming';
  if (currentTime > end) {
    festivalStatus = 'completed';
  } else if (currentTime >= start && currentTime <= end) {
    festivalStatus = 'ongoing';
  }

  // Preorder opening time calculation
  let openTime;
  if (this.preorderSettings.customOpenDate) {
    openTime = new Date(this.preorderSettings.customOpenDate).getTime();
  } else {
    const leadMs = (this.preorderSettings.leadTimeDays || 5) * 24 * 60 * 60 * 1000;
    openTime = start - leadMs;
  }

  // Preorder closing deadline calculation
  let closeDeadline;
  if (this.preorderSettings.customCloseDeadline) {
    closeDeadline = new Date(this.preorderSettings.customCloseDeadline).getTime();
  } else {
    // Default closing deadline is end of festival day in IST (23:59:59.999)
    const endDateObj = new Date(this.endDate);
    endDateObj.setHours(23, 59, 59, 999);
    closeDeadline = endDateObj.getTime();
  }

  // Evaluate Capacity
  const hasCapacityLimit = this.preorderSettings.maxTotalOrders > 0;
  const isCapacityReached = hasCapacityLimit && (this.preorderSettings.currentTotalOrders >= this.preorderSettings.maxTotalOrders);

  // Manual Override evaluation
  const overrideStatus = this.manualOverride?.status || 'auto';

  // Effective Preorder State determination:
  // States: 'not_yet_open', 'open', 'temporarily_closed', 'sold_out', 'deadline_passed', 'festival_completed'
  let preorderStatus = 'not_yet_open';
  let isOrderingAllowed = false;
  let statusReason = '';

  if (!this.isActive || !this.preorderSettings.enabled) {
    preorderStatus = 'temporarily_closed';
    isOrderingAllowed = false;
    statusReason = 'Preorders disabled by owner';
  } else if (currentTime > end) {
    preorderStatus = 'festival_completed';
    isOrderingAllowed = false;
    statusReason = 'Festival has concluded';
  } else if (currentTime > closeDeadline) {
    preorderStatus = 'deadline_passed';
    isOrderingAllowed = false;
    statusReason = 'Preorder deadline has passed';
  } else if (overrideStatus === 'closed') {
    preorderStatus = 'temporarily_closed';
    isOrderingAllowed = false;
    statusReason = this.manualOverride?.reason || 'Temporarily closed by owner';
  } else if (isCapacityReached) {
    preorderStatus = 'sold_out';
    isOrderingAllowed = false;
    statusReason = 'Pre-order capacity reached for this festival';
  } else if (currentTime < openTime && overrideStatus !== 'open') {
    preorderStatus = 'not_yet_open';
    isOrderingAllowed = false;
    statusReason = `Preorders open on ${new Date(openTime).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}`;
  } else {
    // Current time is between openTime and closeDeadline (or manually reopened within valid window)
    preorderStatus = 'open';
    isOrderingAllowed = true;
    statusReason = 'Preorders are currently open';
  }

  const daysUntilFestival = Math.ceil((start - currentTime) / (1000 * 60 * 60 * 24));
  const daysUntilPreOrder = Math.max(0, Math.ceil((openTime - currentTime) / (1000 * 60 * 60 * 24)));

  return {
    festivalStatus,
    preorderStatus,
    isOrderingAllowed,
    statusReason,
    openTime: new Date(openTime),
    closeDeadline: new Date(closeDeadline),
    daysUntilFestival,
    daysUntilPreOrder
  };
};

module.exports = mongoose.model('Festival', festivalSchema);
