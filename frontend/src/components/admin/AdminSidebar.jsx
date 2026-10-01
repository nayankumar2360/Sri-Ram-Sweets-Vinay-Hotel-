import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  HiHome, 
  HiClipboardDocumentList, 
  HiRectangleStack, 
  HiCalendarDays, 
  HiCube, 
  HiChartBar, 
  HiUsers, 
  HiChartPie, 
  HiCog6Tooth,
  HiXMark,
  HiArrowRightOnRectangle
} from 'react-icons/hi2';

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: HiHome, exact: true },
  { name: 'Orders', path: '/admin/orders', icon: HiClipboardDocumentList },
  { name: 'Menu', path: '/admin/menu', icon: HiRectangleStack },
  { name: 'Pre-Orders', path: '/admin/preorders', icon: HiCalendarDays },
  { name: 'Bulk Orders', path: '/admin/bulk-orders', icon: HiCube },
  { name: 'Capacity', path: '/admin/capacity', icon: HiChartBar },
  { name: 'Customers', path: '/admin/customers', icon: HiUsers },
  { name: 'Analytics', path: '/admin/analytics', icon: HiChartPie },
  { name: 'Settings', path: '/admin/settings', icon: HiCog6Tooth },
];

const AdminSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-[#7A1B29] text-white flex flex-col z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}>
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <div>
            <h1 className="font-bold text-lg">Owner Dashboard</h1>
            <p className="text-xs text-white/70">Sri Ram Sweets(Vinay Hotel)</p>
          </div>
          <button onClick={onClose} className="p-2 lg:hidden">
            <HiXMark className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.exact}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) => 
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-[#9B2335] text-white font-medium' 
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-white/20">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#D4A017] flex items-center justify-center text-[#2C1810] font-bold">
              {user?.name?.charAt(0) || 'O'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || 'Owner'}</p>
              <p className="text-xs text-white/70 truncate">{user?.phone}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg transition-colors"
          >
            <HiArrowRightOnRectangle className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
