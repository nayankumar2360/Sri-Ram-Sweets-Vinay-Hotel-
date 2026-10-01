import api from './axios';

// Dashboard
export const getDashboard = () => api.get('/admin/dashboard');
export const getDashboardStats = getDashboard;

// Products
export const getAdminProducts = (params) => api.get('/admin/products', { params });
export const getProducts = getAdminProducts;
export const createProduct = (formData) => api.post('/admin/products', formData, { 
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateProduct = (id, formData) => api.put(`/admin/products/${id}`, formData, { 
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteProduct = (id) => api.delete(`/admin/products/${id}`);
export const toggleAvailability = (id, available) => api.patch(`/admin/products/${id}/availability`, { available });

// Categories
export const getAdminCategories = () => api.get('/admin/categories');
export const getCategories = getAdminCategories;
export const createCategory = (data) => api.post('/admin/categories', data);
export const updateCategory = (id, data) => api.put(`/admin/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/admin/categories/${id}`);

// Orders
export const getAdminOrders = async (params) => {
  const res = await api.get('/admin/orders', { params });
  const raw = res.data;
  const list = Array.isArray(raw) ? raw : (raw?.data || []);
  return {
    ...res,
    data: {
      ...raw,
      orders: list,
      total: list.length,
      pages: Math.max(1, Math.ceil(list.length / (params?.limit || 50)))
    }
  };
};
export const getOrders = getAdminOrders;

export const getAdminOrder = (id) => api.get(`/admin/orders/${id}`);
export const getOrder = getAdminOrder;
export const getOrderById = getAdminOrder;

export const acceptOrder = (id) => api.put(`/admin/orders/${id}/accept`);
export const rejectOrder = (id, reason) => api.put(`/admin/orders/${id}/reject`, { reason });
export const updateOrderStatus = (id, status) => api.put(`/admin/orders/${id}/status`, { status });

// Payments
export const getPayments = (params) => api.get('/admin/payments', { params });
export const verifyPayment = (id, data = {}) => api.put(`/admin/payments/${id}/verify`, data);
export const rejectPayment = (id, reason) => api.put(`/admin/payments/${id}/reject`, typeof reason === 'string' ? { reason } : reason);

// Pre-Orders
export const getAdminPreOrders = () => api.get('/admin/preorders');
export const getPreOrders = getAdminPreOrders;
export const acceptPreOrder = (id) => api.put(`/admin/preorders/${id}/accept`);
export const rejectPreOrder = (id, reason) => api.put(`/admin/preorders/${id}/reject`, { reason });
export const updatePreOrderStatus = (id, status) => api.put(`/admin/preorders/${id}/status`, { status });

// Capacity
export const getCapacities = () => api.get('/admin/capacity');
export const setCapacity = (data) => api.post('/admin/capacity', data);
export const createCapacity = setCapacity;
export const updateCapacity = (id, data) => api.put(`/admin/capacity/${id}`, data);
export const deleteCapacity = (id) => api.delete(`/admin/capacity/${id}`);

// Bulk Orders
export const getAdminBulkOrders = () => api.get('/admin/bulk-orders');
export const getBulkOrders = getAdminBulkOrders;
export const updateBulkOrderStatus = (id, data) => api.put(`/admin/bulk-orders/${id}/status`, typeof data === 'string' ? { status: data } : data);

// Customers
export const getCustomers = () => api.get('/admin/customers');
export const getCustomer = (id) => api.get(`/admin/customers/${id}`);

// Analytics
export const getAnalytics = (period) => api.get('/admin/analytics', { params: { period } });
export const getFestivalAnalytics = () => api.get('/admin/analytics/festivals');
export const getProductAnalytics = () => api.get('/admin/analytics/products');

// Settings
export const getSettings = () => api.get('/admin/settings');
export const updateSettings = (data) => api.put('/admin/settings', data);

// Notifications
export const getAdminNotifications = () => api.get('/admin/notifications');
export const markAdminNotificationRead = (id) => api.put(`/admin/notifications/${id}/read`);
