import React from 'react';
import { useCart } from '../../context/CartContext';
import { formatPrice, truncateText } from '../../utils/formatters';
import { UNITS } from '../../utils/constants';
import toast from 'react-hot-toast';
import { FaLeaf } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem(product, 1);
    toast.success(`Added ${product.name} to cart`);
  };

  const getEmojiForCategory = (category) => {
    if (!category) return '🍬';
    const cat = typeof category === 'object' ? category.name.toLowerCase() : category.toLowerCase();
    if (cat.includes('barfi')) return '🧊';
    if (cat.includes('laddu')) return '🟡';
    if (cat.includes('namkeen')) return '🥨';
    if (cat.includes('cake')) return '🎂';
    return '🍬';
  };

  const unitLabel = UNITS.find(u => u.value === product.unit)?.label || product.unit;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
      {/* Image Placeholder */}
      <div className="h-48 bg-cream flex items-center justify-center text-6xl relative">
        {getEmojiForCategory(product.category)}
        {!product.available && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-error text-white text-xs font-bold px-2 py-1 rounded">
              Currently Unavailable
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-text-primary line-clamp-1" title={product.name}>
            {product.name}
          </h3>
          <FaLeaf className="text-success flex-shrink-0 mt-1" title="Vegetarian" />
        </div>
        
        <p className="text-sm text-text-secondary mb-4 flex-1 line-clamp-2" title={product.description}>
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
          <div>
            <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
            <span className="text-xs text-text-light ml-1">/ {unitLabel}</span>
          </div>
          
          <button
            onClick={handleAdd}
            disabled={!product.available}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              product.available
                ? 'bg-primary text-white hover:bg-primary-dark'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
