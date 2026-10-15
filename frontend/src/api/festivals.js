import api from './axios';

// Public Endpoints
export const getFestivals = (params) => api.get('/festivals', { params });
export const getLiveFestivalBanner = () => api.get('/festivals/live');
export const getFestival = (slugOrId) => api.get(`/festivals/${slugOrId}`);
export const getFestivalProducts = (slugOrId) => api.get(`/festivals/${slugOrId}/products`);

// Owner / Protected Admin Endpoints
export const createFestival = (formData) => api.post('/festivals', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export const updateFestival = (id, formData) => api.put(`/festivals/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export const updateBanner = (id, formData) => api.patch(`/festivals/${id}/banner`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export const updatePreorders = (id, data) => api.patch(`/festivals/${id}/preorders`, data);

export const updateCapacity = (id, data) => api.patch(`/festivals/${id}/capacity`, data);

export const deleteFestival = (id) => api.delete(`/festivals/${id}`);

export const seedFestivals = () => api.post('/festivals/seed');
