import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../menu/ProductCard';

const FeaturedProducts = ({ products }) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="py-16 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-primary font-serif">Our Specialties</h2>
          <div className="mt-2 w-24 h-1 bg-secondary mx-auto rounded"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/menu"
            className="inline-flex items-center justify-center px-6 py-3 border border-primary text-base font-medium rounded-md text-primary bg-transparent hover:bg-primary hover:text-white transition-colors"
          >
            View Full Menu
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
