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
    <nav className="bg-[#FFF9F0] border-b border-[#E8DDD4] sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 gap-4">
          
          {/* Brand Logo & Name */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 group py-1">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-serif text-xl sm:text-2xl font-black text-[#9B2335] tracking-tight whitespace-nowrap group-hover:opacity-90 transition-opacity">
                  Sri Ram Sweets
                </span>
                <span className="text-[11px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-[#D4A017]/20 text-[#9B2335] border border-[#D4A017]/40 whitespace-nowrap shadow-xs">
                  Vinay Hotel
                </span>
              </div>
              <span className="text-[10px] text-[#6B4F3A] tracking-wider uppercase font-medium hidden sm:block">
                Pure Ghee & Traditional Taste • Manpur
              </span>
            </div>
          </Link>

          {/* Desktop Navigation (Visible on lg and above) */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-7 flex-shrink-0">
            <Link 
              to="/" 
              className="text-[#2C1810] hover:text-[#9B2335] font-medium text-sm xl:text-base whitespace-nowrap transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/menu" 
              className="text-[#2C1810] hover:text-[#9B2335] font-medium text-sm xl:text-base whitespace-nowrap transition-colors"
            >
              Menu
            </Link>
            <Link 
              to="/pre-order" 
              className="text-[#2C1810] hover:text-[#9B2335] font-medium text-sm xl:text-base whitespace-nowrap transition-colors"
            >
              Pre-Order
            </Link>
            <Link 
              to="/bulk-order" 
              className="text-[#2C1810] hover:text-[#9B2335] font-medium text-sm xl:text-base whitespace-nowrap transition-colors"
            >
              Bulk Order
            </Link>
            <Link 
              to="/poster" 
              className="text-[#9B2335] hover:bg-[#9B2335] hover:text-white font-semibold text-xs border border-[#D4A017] px-2.5 py-1 rounded-full whitespace-nowrap transition-all shadow-xs"
            >
              QR Poster
            </Link>
            
            {/* Cart Icon */}
            <Link 
              to="/cart" 
              className="relative p-2 text-[#2C1810] hover:text-[#9B2335] transition-colors"
              title="Cart"
            >
              <FaShoppingCart size={19} />
              {itemCount > 0 && (
                <span className="absolute 0 top-0.5 right-0.5 bg-[#D4A017] text-white text-[11px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-xs">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Authenticated Customer Links */}
            {isAuthenticated ? (
              <div className="flex items-center gap-4 xl:gap-5 pl-2 border-l border-[#E8DDD4]">
                <Link 
                  to="/orders" 
                  className="text-[#2C1810] hover:text-[#9B2335] font-medium text-sm xl:text-base whitespace-nowrap transition-colors"
                >
                  Orders
                </Link>

                {/* Notifications Bell */}
                <Link 
                  to="/orders" 
                  className="relative p-2 text-[#2C1810] hover:text-[#9B2335] transition-colors"
                  title="Notifications"
                >
                  <FaBell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 bg-[#DC2626] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                {/* User Profile */}
                <Link 
                  to="/profile" 
                  className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-white border border-[#E8DDD4] text-[#2C1810] hover:border-[#9B2335] hover:text-[#9B2335] transition-colors max-w-[150px]"
                >
                  <FaUser className="text-xs text-[#9B2335] flex-shrink-0" />
                  <span className="font-semibold text-xs truncate">
                    {user?.name || 'Account'}
                  </span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3 pl-2 border-l border-[#E8DDD4]">
                <Link 
                  to="/login" 
                  className="text-[#9B2335] font-semibold text-sm hover:underline whitespace-nowrap px-2 py-1"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-[#9B2335] text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#7A1B29] transition-colors whitespace-nowrap shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Right Mobile / Tablet Controls (Visible below lg) */}
          <div className="flex items-center lg:hidden gap-3">
            <Link 
              to="/cart" 
              className="relative p-2 text-[#2C1810] hover:text-[#9B2335]"
              title="Cart"
            >
              <FaShoppingCart size={22} />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#D4A017] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            <button 
              onClick={toggleMenu} 
              className="p-2 rounded-lg text-[#2C1810] hover:bg-white hover:text-[#9B2335] transition-colors border border-transparent hover:border-[#E8DDD4]"
              aria-label="Toggle Navigation Menu"
            >
              {isMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu (Visible below lg) */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#E8DDD4] shadow-lg animate-fadeIn">
          <div className="px-4 pt-3 pb-5 space-y-2">
            <Link 
              to="/" 
              onClick={toggleMenu} 
              className="block px-3 py-2.5 rounded-lg text-[#2C1810] font-medium hover:bg-[#FFF9F0] hover:text-[#9B2335]"
            >
              Home
            </Link>
            <Link 
              to="/menu" 
              onClick={toggleMenu} 
              className="block px-3 py-2.5 rounded-lg text-[#2C1810] font-medium hover:bg-[#FFF9F0] hover:text-[#9B2335]"
            >
              Menu
            </Link>
            <Link 
              to="/pre-order" 
              onClick={toggleMenu} 
              className="block px-3 py-2.5 rounded-lg text-[#2C1810] font-medium hover:bg-[#FFF9F0] hover:text-[#9B2335]"
            >
              Festival Pre-Order
            </Link>
            <Link 
              to="/bulk-order" 
              onClick={toggleMenu} 
              className="block px-3 py-2.5 rounded-lg text-[#2C1810] font-medium hover:bg-[#FFF9F0] hover:text-[#9B2335]"
            >
              Bulk Orders & Catering
            </Link>
            <Link 
              to="/poster" 
              onClick={toggleMenu} 
              className="block px-3 py-2.5 rounded-lg text-[#9B2335] font-semibold bg-[#FFF9F0] border border-[#D4A017]/30"
            >
              Scan & Print QR Poster
            </Link>

            {isAuthenticated ? (
              <div className="pt-3 border-t border-[#E8DDD4] space-y-2">
                <Link 
                  to="/orders" 
                  onClick={toggleMenu} 
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-[#2C1810] font-medium hover:bg-[#FFF9F0] hover:text-[#9B2335]"
                >
                  <span>My Orders</span>
                  {unreadCount > 0 && (
                    <span className="bg-[#DC2626] text-white text-xs px-2 py-0.5 rounded-full font-bold">
                      {unreadCount} new
                    </span>
                  )}
                </Link>
                <Link 
                  to="/profile" 
                  onClick={toggleMenu} 
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[#2C1810] font-medium hover:bg-[#FFF9F0] hover:text-[#9B2335]"
                >
                  <FaUser className="text-xs text-[#9B2335]" />
                  <span>Profile ({user?.name || 'Account'})</span>
                </Link>
              </div>
            ) : (
              <div className="pt-3 border-t border-[#E8DDD4] grid grid-cols-2 gap-3">
                <Link 
                  to="/login" 
                  onClick={toggleMenu} 
                  className="text-center py-2.5 px-4 rounded-lg border border-[#9B2335] text-[#9B2335] font-semibold text-sm hover:bg-[#FFF9F0]"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  onClick={toggleMenu} 
                  className="text-center py-2.5 px-4 rounded-lg bg-[#9B2335] text-white font-semibold text-sm hover:bg-[#7A1B29]"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
