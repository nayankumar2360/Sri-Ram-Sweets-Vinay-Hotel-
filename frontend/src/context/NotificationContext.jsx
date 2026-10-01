import React, { createContext, useState, useEffect, useContext } from 'react';
import { getNotifications, markAsRead as markAsReadApi, markAllAsRead as markAllAsReadApi } from '../api/notifications';
import { useAuth } from '../hooks/useAuth';

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { isAuthenticated } = useAuth();

  const fetchNotifications = async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      return;
    }
    try {
      const res = await getNotifications();
      const notifData = res.data?.data || res.data || [];
      setNotifications(Array.isArray(notifData) ? notifData : []);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
      setNotifications([]);
    }
  };

  useEffect(() => {
    fetchNotifications();
    let interval;
    if (isAuthenticated) {
      interval = setInterval(fetchNotifications, 30000); // 30s
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAuthenticated]);

  const markRead = async (id) => {
    try {
      await markAsReadApi(id);
      setNotifications(prev => (Array.isArray(prev) ? prev : []).map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      await markAllAsReadApi();
      setNotifications(prev => (Array.isArray(prev) ? prev : []).map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  const unreadCount = safeNotifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markRead,
      markAllRead,
      fetchNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
