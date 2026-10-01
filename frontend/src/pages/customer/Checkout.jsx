import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../hooks/useAuth';
import { createOrder } from '../../api/orders';
import { getPublicSettings } from '../../api/products';
import CartSummary from '../../components/cart/CartSummary';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { items, subtotal, getDeliveryCharge, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [fulfillmentType, setFulfillmentType] = useState('pickup');
  const [address, setAddress] = useState(user?.addresses?.[0] || { street: '', city: '', state: '', pincode: '' });
  const [notes, setNotes] = useState('');
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
    const fetchSettings = async () => {
      try {
        const res = await getPublicSettings();
        setSettings(res.data?.data || res.data);
      } catch (err) {}
    };
    fetchSettings();
  }, [items, navigate]);

  const handlePlaceOrder = async () => {
    if (fulfillmentType === 'delivery') {
      if (!address.street || !address.city || !address.pincode) {
        toast.error('Please fill all required address fields');
        return;
      }
    }

    setLoading(true);
    try {
      const orderData = {
        items: items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price
        })),
        fulfillmentType,
        deliveryAddress: fulfillmentType === 'delivery' ? address : undefined,
        notes
      };

      const res = await createOrder(orderData);
      clearCart();
      toast.success('Order placed successfully!');
      const orderId = res.data?._id || res.data?.data?._id;
      navigate(orderId ? `/orders/${orderId}` : '/orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const deliveryCharge = fulfillmentType === 'delivery' ? getDeliveryCharge(settings) : 0;
  const total = subtotal + deliveryCharge;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-primary font-serif mb-8">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          
          {/* Fulfillment Selection */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
            <h3 className="text-xl font-semibold mb-4 border-b border-border pb-2">Fulfillment Method</h3>
            <div className="flex gap-4">
              <label className={`flex-1 p-4 border rounded-md cursor-pointer transition-colors ${fulfillmentType === 'pickup' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                <input type="radio" name="fulfillment" value="pickup" checked={fulfillmentType === 'pickup'} onChange={(e) => setFulfillmentType(e.target.value)} className="hidden" />
                <span className="font-semibold block mb-1">Store Pickup</span>
                <span className="text-sm text-text-secondary">Pick up from our store</span>
              </label>
              
              <label className={`flex-1 p-4 border rounded-md cursor-pointer transition-colors ${(!settings?.isDeliveryAvailable && !settings?.deliveryEnabled) ? 'opacity-50 cursor-not-allowed' : fulfillmentType === 'delivery' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                <input type="radio" name="fulfillment" value="delivery" disabled={!settings?.isDeliveryAvailable && !settings?.deliveryEnabled} checked={fulfillmentType === 'delivery'} onChange={(e) => setFulfillmentType(e.target.value)} className="hidden" />
                <span className="font-semibold block mb-1">Home Delivery</span>
                <span className="text-sm text-text-secondary">{(settings?.isDeliveryAvailable ?? settings?.deliveryEnabled) ? 'Delivered to your door' : 'Delivery unavailable'}</span>
              </label>
            </div>

            {fulfillmentType === 'pickup' && (
              <div className="mt-4 p-3 bg-amber-50 rounded-md border border-amber-200 text-xs text-[#2C1810]">
                <span className="font-bold block mb-0.5">🏪 Store Pickup Address:</span>
                <p>{settings?.address || 'Q2VC+MV6, Hdfc Bank Road, Manpur, Bihar 823003'}</p>
                <p className="text-text-secondary mt-1">Helpline: {settings?.phone || '8292734852'}</p>
              </div>
            )}
          </div>

          {/* Address Form */}
          {fulfillmentType === 'delivery' && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
              <h3 className="text-xl font-semibold mb-4 border-b border-border pb-2">Delivery Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Street Address *</label>
                  <input type="text" value={address.street} onChange={(e) => setAddress({...address, street: e.target.value})} className="w-full px-3 py-2 border border-border rounded-md focus:ring-primary focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">City *</label>
                  <input type="text" value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} className="w-full px-3 py-2 border border-border rounded-md focus:ring-primary focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Pincode *</label>
                  <input type="text" value={address.pincode} onChange={(e) => setAddress({...address, pincode: e.target.value})} className="w-full px-3 py-2 border border-border rounded-md focus:ring-primary focus:border-primary" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">State</label>
                  <input type="text" value={address.state} onChange={(e) => setAddress({...address, state: e.target.value})} className="w-full px-3 py-2 border border-border rounded-md focus:ring-primary focus:border-primary" />
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
            <h3 className="text-xl font-semibold mb-4 border-b border-border pb-2">Additional Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special instructions for your order?"
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-md focus:ring-primary focus:border-primary"
            ></textarea>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-96">
          <CartSummary
            subtotal={subtotal}
            deliveryCharge={deliveryCharge}
            total={total}
            onProceed={handlePlaceOrder}
            buttonText={loading ? 'Placing Order...' : 'Place Order'}
            settings={settings}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
