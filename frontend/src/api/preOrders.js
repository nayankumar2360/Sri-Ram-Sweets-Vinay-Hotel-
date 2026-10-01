import api from './axios';

export const createPreOrder = (data) => api.post('/pre-orders', data);
export const getPreOrders = () => api.get('/pre-orders');
export const getPreOrder = (id) => api.get(`/pre-orders/${id}`);
export const checkCapacity = (params) => api.get('/pre-orders/capacity/check', { params });
export const getFestivals = () => api.get('/festivals/active');
export const submitPreOrderPayment = (preOrderId, formData) => {
  return api.post(`/pre-orders/${preOrderId}/payment`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
