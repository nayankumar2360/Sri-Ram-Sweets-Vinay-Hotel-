import api from './axios';

export const createOrder = (data) => api.post('/orders', data);
export const getOrders = () => api.get('/orders');
export const getOrder = (id) => api.get(`/orders/${id}`);
export const submitPayment = (orderId, formData) => {
  return api.post(`/orders/${orderId}/payment`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
