import React, { createContext, useState, useEffect, useContext } from 'react';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.product._id === product._id);
      if (existing) {
        return prev.map(i => i.product._id === product._id 
          ? { ...i, quantity: i.quantity + quantity }
          : i
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeItem = (productId) => {
    setItems(prev => prev.filter(i => i.product._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems(prev => prev.map(i => i.product._id === productId ? { ...i, quantity } : i));
  };

  const clearCart = () => setItems([]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const getDeliveryCharge = (settings) => {
    const isAvail = settings?.isDeliveryAvailable ?? settings?.deliveryEnabled ?? true;
    if (!isAvail) return 0;
    if (subtotal >= (settings?.minOrderForFreeDelivery ?? 500)) return 0;
    return settings?.deliveryCharge ?? 30;
  };

  const getTotal = (settings) => {
    return subtotal + getDeliveryCharge(settings);
  };

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      itemCount,
      subtotal,
      getDeliveryCharge,
      getTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
