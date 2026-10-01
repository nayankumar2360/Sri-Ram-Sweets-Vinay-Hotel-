import React from 'react';
import { formatPrice } from '../../utils/formatters';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const { product, quantity } = item;
  const subtotal = product.price * quantity;

  return (
    <div className="flex items-center justify-between py-4 border-b border-border">
      <div className="flex-1">
        <h4 className="text-lg font-semibold text-text-primary">{product.name}</h4>
        <div className="text-sm text-text-secondary">
          {formatPrice(product.price)} / {product.unit}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center border border-border rounded-md">
          <button
            onClick={() => onUpdateQuantity(product._id, quantity - 1)}
            className="p-2 text-text-secondary hover:text-primary transition-colors"
          >
            <FaMinus size={12} />
          </button>
          <span className="w-8 text-center text-sm font-medium">{quantity}</span>
          <button
            onClick={() => onUpdateQuantity(product._id, quantity + 1)}
            className="p-2 text-text-secondary hover:text-primary transition-colors"
          >
            <FaPlus size={12} />
          </button>
        </div>

        <div className="w-24 text-right font-semibold text-text-primary">
          {formatPrice(subtotal)}
        </div>

        <button
          onClick={() => onRemove(product._id)}
          className="text-error hover:text-red-700 p-2 transition-colors"
          title="Remove item"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
