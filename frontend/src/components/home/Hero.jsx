import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r from-primary to-accent overflow-hidden">
      <div className="absolute inset-0 opacity-10 pattern-dots"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl font-serif mb-6">
            <span className="block">Your Favourite Sweets,</span>
            <span className="block text-secondary-light">Now Just a Click Away</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-cream sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Order directly from Sri Ram Sweets(Vinay Hotel) for everyday cravings, family functions and festival celebrations.
          </p>
          <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center gap-4 space-y-4 sm:space-y-0">
            <Link
              to="/menu"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-cream md:py-4 md:text-lg md:px-10 transition-colors shadow-lg"
            >
              Order Now
            </Link>
            <Link
              to="/pre-order"
              className="w-full flex items-center justify-center px-8 py-3 border-2 border-secondary-light text-base font-medium rounded-md text-secondary-light hover:bg-secondary-light hover:text-primary md:py-4 md:text-lg md:px-10 transition-colors"
            >
              Festival Pre-Orders
            </Link>
            <Link
              to="/bulk-order"
              className="w-full flex items-center justify-center px-8 py-3 border-2 border-transparent text-base font-medium rounded-md text-white bg-primary-dark hover:bg-opacity-80 md:py-4 md:text-lg md:px-10 transition-colors"
            >
              Bulk Orders
            </Link>
          </div>
        </div>
      </div>
      {/* Decorative bottom border */}
      <div className="h-4 bg-secondary flex justify-around items-center opacity-80">
        <span className="text-xs text-primary-dark">❖</span>
        <span className="text-xs text-primary-dark">❖</span>
        <span className="text-xs text-primary-dark">❖</span>
        <span className="text-xs text-primary-dark">❖</span>
        <span className="text-xs text-primary-dark">❖</span>
      </div>
    </div>
  );
};

export default Hero;
