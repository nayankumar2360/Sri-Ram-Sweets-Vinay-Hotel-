import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from './AdminSidebar';
import { HiBars3, HiBell } from 'react-icons/hi2';
import * as adminApi from '../../api/admin';
import { formatDateTime } from '../../utils/formatters';

const AdminLayout = () => {
  const { user, isOwner } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [adminNotifs, setAdminNotifs] = useState([]);
  const notifRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await adminApi.getAdminNotifications();
      const notifs = res.data?.data || res.data || [];
      setAdminNotifs(Array.isArray(notifs) ? notifs : []);
    } catch (error) {
      console.error('Failed to fetch admin notifications', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await adminApi.markAdminNotificationRead(id);
      setAdminNotifs(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const unread = adminNotifs.filter(n => !n.read);
      await Promise.all(unread.map(n => adminApi.markAdminNotificationRead(n._id)));
      setAdminNotifs(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark all notifications as read', err);
    }
  };

  const unreadCount = adminNotifs?.filter(n => !n.read)?.length || 0;

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
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setIsNotifOpen(prev => !prev)}
                className="relative p-2 text-[#6B4F3A] hover:text-[#9B2335] transition-colors"
                aria-label="Notifications"
              >
                <HiBell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#DC2626] rounded-full"></span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-[#E8DDD4] z-50 overflow-hidden">
                  <div className="p-3 border-b border-[#E8DDD4] flex items-center justify-between bg-[#FFF9F0]">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-sm text-[#2C1810]">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 text-xs bg-[#9B2335] text-white rounded-full font-medium">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs text-[#9B2335] hover:underline font-medium"
                      >
                        Mark All Read
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto divide-y divide-[#E8DDD4]">
                    {adminNotifs.length === 0 ? (
                      <div className="p-6 text-center text-sm text-[#6B4F3A]">
                        No notifications
                      </div>
                    ) : (
                      adminNotifs.map((notif) => (
                        <div
                          key={notif._id}
                          onClick={() => handleMarkAsRead(notif._id)}
                          className={`p-3 transition-colors cursor-pointer hover:bg-gray-50 flex items-start space-x-3 ${
                            !notif.read ? 'bg-[#FFF9F0]' : 'bg-white'
                          }`}
                        >
                          <span
                            className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                              !notif.read ? 'bg-[#DC2626]' : 'bg-transparent'
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[#2C1810] truncate">
                              {notif.title}
                            </p>
                            <p className="text-xs text-[#6B4F3A] mt-0.5 line-clamp-2">
                              {notif.message}
                            </p>
                            {(notif.createdAt || notif.time) && (
                              <p className="text-[10px] text-[#A08068] mt-1">
                                {formatDateTime(notif.createdAt || notif.time)}
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
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
