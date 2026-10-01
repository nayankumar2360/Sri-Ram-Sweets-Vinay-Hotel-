import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../context/CartContext';
import { useNotifications } from '../../context/NotificationContext';
import { FaShoppingCart, FaUser, FaBell, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const { itemCount } = useCart();
  const { unreadCount } = useNotifications();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Don't render on admin routes
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-cream sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="font-serif text-2xl md:text-3xl font-bold text-primary">
                Sri Ram Sweets(Vinay Hotel)
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-text-primary hover:text-primary font-medium">Home</Link>
            <Link to="/menu" className="text-text-primary hover:text-primary font-medium">Menu</Link>
            <Link to="/pre-order" className="text-text-primary hover:text-primary font-medium">Pre-Order</Link>
            <Link to="/bulk-order" className="text-text-primary hover:text-primary font-medium">Bulk Order</Link>
            <Link to="/poster" className="text-text-primary hover:text-primary font-medium text-xs bg-[#FFF9F0] border border-[#D4A017] px-2.5 py-1 rounded-full text-[#9B2335] font-semibold">QR Poster</Link>
            
            <Link to="/cart" className="relative text-text-primary hover:text-primary">
              <FaShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/orders" className="text-text-primary hover:text-primary font-medium">Orders</Link>
                <div className="relative cursor-pointer">
                  <FaBell size={20} className="text-text-primary hover:text-primary" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-error text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <Link to="/profile" className="flex items-center space-x-2 text-text-primary hover:text-primary">
                  <FaUser />
                  <span className="font-medium truncate max-w-[100px]">{user?.name}</span>
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-primary font-medium hover:text-primary-dark">Login</Link>
                <Link to="/register" className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition">Register</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden space-x-4">
            <Link to="/cart" className="relative text-text-primary">
              <FaShoppingCart size={24} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button onClick={toggleMenu} className="text-text-primary">
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-cream border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" onClick={toggleMenu} className="block px-3 py-2 text-text-primary hover:bg-primary hover:text-white rounded-md">Home</Link>
            <Link to="/menu" onClick={toggleMenu} className="block px-3 py-2 text-text-primary hover:bg-primary hover:text-white rounded-md">Menu</Link>
            <Link to="/pre-order" onClick={toggleMenu} className="block px-3 py-2 text-text-primary hover:bg-primary hover:text-white rounded-md">Pre-Order</Link>
            <Link to="/bulk-order" onClick={toggleMenu} className="block px-3 py-2 text-text-primary hover:bg-primary hover:text-white rounded-md">Bulk Order</Link>
            <Link to="/poster" onClick={toggleMenu} className="block px-3 py-2 text-[#9B2335] font-semibold hover:bg-primary hover:text-white rounded-md">Scan & Print Poster</Link>
            {isAuthenticated ? (
              <>
                <Link to="/orders" onClick={toggleMenu} className="block px-3 py-2 text-text-primary hover:bg-primary hover:text-white rounded-md">Orders</Link>
                <Link to="/profile" onClick={toggleMenu} className="block px-3 py-2 text-text-primary hover:bg-primary hover:text-white rounded-md">Profile ({user?.name})</Link>
              </>
            ) : (
              <>
                <Link to="/login" onClick={toggleMenu} className="block px-3 py-2 text-text-primary hover:bg-primary hover:text-white rounded-md">Login</Link>
                <Link to="/register" onClick={toggleMenu} className="block px-3 py-2 text-text-primary hover:bg-primary hover:text-white rounded-md">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
