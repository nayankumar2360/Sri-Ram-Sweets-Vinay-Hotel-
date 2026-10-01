import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../hooks/useAuth';
import CartItem from '../../components/cart/CartItem';
import CartSummary from '../../components/cart/CartSummary';
import { getPublicSettings } from '../../api/products';
import { FaShoppingBag } from 'react-icons/fa';

const Cart = () => {
  const { items, updateQuantity, removeItem, subtotal, getDeliveryCharge, getTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setSettings(res.data?.data || res.data);
      } catch (err) {
        console.error('Failed to fetch settings');
      }
    };
    fetchSettings();
  }, []);

  const handleProceed = () => {
    if (!isAuthenticated) {
      navigate('/login?returnUrl=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <FaShoppingBag className="mx-auto h-24 w-24 text-gray-300 mb-6" />
        <h2 className="text-2xl font-bold text-text-primary mb-2">Your cart is empty</h2>
        <p className="text-text-secondary mb-8">Looks like you haven't added any sweets yet.</p>
        <Link
          to="/menu"
          className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark transition-colors"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-primary font-serif mb-8">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 bg-white p-6 rounded-lg shadow-sm border border-border">
          <div className="hidden sm:grid sm:grid-cols-12 gap-4 border-b border-border pb-4 mb-4 text-sm font-medium text-text-secondary">
            <div className="col-span-6">Product</div>
            <div className="col-span-3 text-center">Quantity</div>
            <div className="col-span-2 text-right">Subtotal</div>
            <div className="col-span-1 text-center">Action</div>
          </div>
          
          <div className="space-y-2">
            {items.map((item) => (
              <CartItem
                key={item.product._id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>

          <div className="mt-8">
            <Link to="/menu" className="text-primary hover:text-primary-dark font-medium">
              &larr; Continue Shopping
            </Link>
          </div>
        </div>

        <div className="lg:w-96">
          <CartSummary
            subtotal={subtotal}
            deliveryCharge={getDeliveryCharge(settings)}
            total={getTotal(settings)}
            onProceed={handleProceed}
            settings={settings}
          />
        </div>
      </div>
    </div>
  );
};

export default Cart;
