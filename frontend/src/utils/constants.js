// Status values (for programmatic use)
export const ORDER_STATUSES = {
  PLACED: 'placed',
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
};

// Human-readable labels for display
export const ORDER_STATUS_LABELS = {
  placed: 'Placed',
  pending: 'Pending',
  accepted: 'Accepted',
  payment_pending: 'Payment Pending',
  payment_verified: 'Payment Verified',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready: 'Ready',
  out_for_delivery: 'Out for Delivery',
  completed: 'Completed',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
};

export const PAYMENT_STATUSES = {
  PENDING: 'pending',
  SUBMITTED: 'submitted',
  VERIFIED: 'verified',
  FAILED: 'failed',
};

export const PAYMENT_STATUS_LABELS = {
  pending: 'Pending',
  submitted: 'Submitted',
  verified: 'Verified',
  failed: 'Failed',
};

export const BULK_ORDER_STATUSES = {
  REQUESTED: 'requested',
  CONTACTED: 'contacted',
  QUOTATION: 'quotation',
  ACCEPTED: 'accepted',
  PAYMENT_PENDING: 'payment_pending',
  PAID: 'paid',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const BULK_ORDER_STATUS_LABELS = {
  requested: 'Requested',
  contacted: 'Contacted',
  quotation: 'Quotation / Discussion',
  accepted: 'Accepted',
  payment_pending: 'Payment Pending',
  paid: 'Paid',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready: 'Ready',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const EVENT_TYPES = [
  { value: 'wedding', label: 'Wedding' },
  { value: 'birthday', label: 'Birthday Party' },
  { value: 'school_function', label: 'School Function' },
  { value: 'office_event', label: 'Office Event' },
  { value: 'family_function', label: 'Family Function' },
  { value: 'religious_event', label: 'Religious Event' },
  { value: 'festival', label: 'Festival' },
  { value: 'other', label: 'Other' }
];

export const FULFILLMENT_TYPES = [
  { value: 'pickup', label: 'Counter Pickup' },
  { value: 'delivery', label: 'Home Delivery' }
];

export const UNITS = [
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: 'half_kg', label: '500 gm' },
  { value: '250g', label: '250 gm' },
  { value: 'piece', label: 'Piece' },
  { value: 'plate', label: 'Plate' },
  { value: 'glass', label: 'Glass' },
  { value: 'box', label: 'Box' },
  { value: 'dozen', label: 'Dozen' }
];
