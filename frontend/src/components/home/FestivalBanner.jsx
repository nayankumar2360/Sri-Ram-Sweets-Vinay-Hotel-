import React from 'react';
import { Link } from 'react-router-dom';

const FestivalBanner = ({ festivals }) => {
  if (!festivals || festivals.length === 0) return null;

  const currentFestival = festivals[0];

  return (
    <div className="bg-gradient-to-r from-accent to-secondary-light py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="text-white mb-4 md:mb-0">
          <h3 className="text-2xl font-bold font-serif mb-1">🎉 {currentFestival.name} Special 🎉</h3>
          <p className="text-white opacity-90">Pre-order now to guarantee availability for the festival!</p>
        </div>
        <Link
          to="/pre-order"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-accent bg-white hover:bg-cream shadow-md transition-colors whitespace-nowrap"
        >
          Pre-Order Now
        </Link>
      </div>
    </div>
  );
};

export default FestivalBanner;
