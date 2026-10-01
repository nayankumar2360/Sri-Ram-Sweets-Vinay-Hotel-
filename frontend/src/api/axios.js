import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('token');
    
    // Only redirect if NOT on an auth page and NOT during login/register/profile check
    const currentPath = window.location.pathname;
    const isAuthPage = currentPath === '/login' || 
                       currentPath === '/register' || 
                       currentPath === '/admin/login';
    const isAuthEndpoint = error.config?.url?.includes('/auth/');

    if (!isAuthPage && !isAuthEndpoint) {
      if (currentPath.startsWith('/admin')) {
        window.location.href = '/admin/login';
      } else {
        window.location.href = '/login';
      }
    }
  }
  return Promise.reject(error);
});

export default api;
