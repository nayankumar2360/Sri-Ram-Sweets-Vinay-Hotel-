import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-[#2C1810] text-cream py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif text-2xl font-bold text-secondary mb-4">Sri Ram Sweets(Vinay Hotel)</h3>
            <p className="text-text-light mb-4">Made fresh daily with traditional recipes. Order directly from us for the best prices and authentic taste.</p>
            <div className="text-text-light space-y-1">
              <p>📍 Q2VC+MV6, Hdfc Bank Road, Manpur, Bihar 823003</p>
              <p>📞 +91 82927 34852</p>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-secondary-light">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/menu" className="text-text-light hover:text-white transition">Full Menu</Link></li>
              <li><Link to="/pre-order" className="text-text-light hover:text-white transition">Festival Pre-Orders</Link></li>
              <li><Link to="/bulk-order" className="text-text-light hover:text-white transition">Bulk & Event Orders</Link></li>
              <li><Link to="/admin/login" className="text-secondary-light hover:text-white transition font-medium">Owner Portal</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-secondary-light">Opening Hours</h4>
            <ul className="space-y-2 text-text-light">
              <li>Monday - Sunday</li>
              <li>8:00 AM - 10:00 PM</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center text-text-light text-sm">
          <p>© {new Date().getFullYear()} Sri Ram Sweets(Vinay Hotel). All rights reserved.</p>
          <Link to="/admin/login" className="text-xs text-gray-400 hover:text-secondary-light mt-2 sm:mt-0 transition">
            Owner / Staff Login
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
