import React from 'react';
import { formatPrice } from '../../utils/formatters';

const CartSummary = ({ subtotal, deliveryCharge, total, onProceed, buttonText = "Proceed to Checkout", settings }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
      <h3 className="text-lg font-semibold text-text-primary mb-4 border-b border-border pb-2">Order Summary</h3>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-text-secondary">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        
        <div className="flex justify-between text-text-secondary">
          <span>Delivery Charge</span>
          <span>
            {deliveryCharge === 0 
              ? <span className="text-success font-medium">FREE</span>
              : formatPrice(deliveryCharge)
            }
          </span>
        </div>
        
        {settings?.minOrderForFreeDelivery > 0 && deliveryCharge > 0 && (
          <div className="text-xs text-text-light bg-cream p-2 rounded">
            Add {formatPrice(settings.minOrderForFreeDelivery - subtotal)} more for free delivery!
          </div>
        )}
        
        <div className="border-t border-border pt-3 mt-3">
          <div className="flex justify-between text-lg font-bold text-text-primary">
            <span>Total</span>
            <span className="text-primary">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      <button
        onClick={onProceed}
        className="w-full bg-primary text-white py-3 rounded-md font-medium hover:bg-primary-dark transition-colors shadow-sm"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default CartSummary;
