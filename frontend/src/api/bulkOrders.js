import api from './axios';

export const createBulkOrder = (data) => api.post('/bulk-orders', data);
export const getBulkOrders = () => api.get('/bulk-orders');
export const getBulkOrder = (id) => api.get(`/bulk-orders/${id}`);
