import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';

// Customer Pages
import Home from './pages/customer/Home';
import Menu from './pages/customer/Menu';
import Login from './pages/customer/Login';
import Register from './pages/customer/Register';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import Orders from './pages/customer/Orders';
import OrderDetail from './pages/customer/OrderDetail';
import PreOrder from './pages/customer/PreOrder';
import BulkOrder from './pages/customer/BulkOrder';
import Profile from './pages/customer/Profile';
import PosterPage from './pages/customer/PosterPage';

// Admin Components & Pages
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminOrderDetail from './pages/admin/AdminOrderDetail';
import AdminMenu from './pages/admin/AdminMenu';
import AdminPreOrders from './pages/admin/AdminPreOrders';
import AdminBulkOrders from './pages/admin/AdminBulkOrders';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminSettings from './pages/admin/AdminSettings';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminCapacity from './pages/admin/AdminCapacity';

function MainLayout() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const isPosterPath = location.pathname === '/poster';
  const hideCustomerChrome = isAdminPath || isPosterPath;

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF9F0] text-[#2C1810]">
      {!hideCustomerChrome && <Navbar />}
      <main className="flex-1">
        <Routes>
          {/* Public Customer Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/pre-order" element={<PreOrder />} />
          <Route path="/poster" element={<PosterPage />} />
          
          {/* Protected Customer Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/bulk-order" element={<BulkOrder />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Admin Authentication */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="orders/:id" element={<AdminOrderDetail />} />
              <Route path="menu" element={<AdminMenu />} />
              <Route path="preorders" element={<AdminPreOrders />} />
              <Route path="bulk-orders" element={<AdminBulkOrders />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="capacity" element={<AdminCapacity />} />
            </Route>
          </Route>
        </Routes>
      </main>
      {!hideCustomerChrome && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NotificationProvider>
          <MainLayout />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#2C1810',
                color: '#FFF9F0',
                border: '1px solid #E8DDD4',
                borderRadius: '0.75rem',
                fontSize: '0.875rem'
              },
            }}
          />
        </NotificationProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
