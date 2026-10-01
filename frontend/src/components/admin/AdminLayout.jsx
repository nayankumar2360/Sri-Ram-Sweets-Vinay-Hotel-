import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from './AdminSidebar';
import { HiBars3, HiBell } from 'react-icons/hi2';
import { useNotifications } from '../../context/NotificationContext';

const AdminLayout = () => {
  const { user, isOwner } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { notifications } = useNotifications();

  const unreadCount = notifications?.filter(n => !n.read)?.length || 0;

  if (!user || !isOwner) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex h-screen bg-[#FFF9F0] overflow-hidden">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header for Mobile & Desktop */}
        <header className="bg-white border-b border-[#E8DDD4] h-16 flex items-center justify-between px-4 lg:px-8 z-10 shrink-0">
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="mr-4 p-2 text-[#6B4F3A] hover:bg-gray-100 rounded-md lg:hidden"
            >
              <HiBars3 className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-[#9B2335] hidden sm:block">
              Sri Ram Sweets(Vinay Hotel)
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-[#6B4F3A] hover:text-[#9B2335] transition-colors">
              <HiBell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#DC2626] rounded-full"></span>
              )}
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
