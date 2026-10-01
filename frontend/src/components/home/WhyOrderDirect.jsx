import React from 'react';
import { FaStar, FaRupeeSign, FaCalendarAlt, FaGift } from 'react-icons/fa';

const WhyOrderDirect = () => {
  const benefits = [
    {
      icon: <FaStar className="h-8 w-8 text-secondary" />,
      title: 'Fresh & Authentic',
      description: 'Made fresh daily with traditional recipes and pure ingredients.'
    },
    {
      icon: <FaRupeeSign className="h-8 w-8 text-secondary" />,
      title: 'Direct Pricing',
      description: 'No middleman or platform charges, best prices guaranteed.'
    },
    {
      icon: <FaCalendarAlt className="h-8 w-8 text-secondary" />,
      title: 'Festival Pre-Orders',
      description: 'Skip the line and book your festive sweets in advance.'
    },
    {
      icon: <FaGift className="h-8 w-8 text-secondary" />,
      title: 'Bulk Orders Welcome',
      description: 'Weddings, parties, events - we handle orders of all sizes.'
    }
  ];

  return (
    <div className="py-16 bg-cream border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-primary font-serif">Why Order Directly From Us?</h2>
          <div className="mt-2 w-24 h-1 bg-secondary mx-auto rounded"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-border text-center hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-cream mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">{benefit.title}</h3>
              <p className="text-text-secondary">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyOrderDirect;
