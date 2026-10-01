import React, { useState, useEffect } from 'react';
import * as adminApi from '../../api/admin';
import OrderTable from '../../components/admin/OrderTable';
import { ORDER_STATUSES } from '../../utils/constants';
import toast from 'react-hot-toast';

const AdminPreOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: 'preorder',
    status: '',
    search: '',
    page: 1,
    limit: 50
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getOrders(filters);
      setOrders(res.data.orders);
    } catch (error) {
      toast.error('Failed to load pre-orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const handleAction = async (action, orderId, statusValue = null) => {
    try {
      if (action === 'accept') {
        await adminApi.updateOrderStatus(orderId, ORDER_STATUSES.ACCEPTED);
        toast.success('Pre-order accepted');
      } else if (action === 'reject') {
        const reason = window.prompt('Enter reason for rejection:');
        if (reason !== null) {
          await adminApi.updateOrderStatus(orderId, ORDER_STATUSES.REJECTED);
          toast.success('Pre-order rejected');
        }
      } else if (action === 'update_status' && statusValue) {
        await adminApi.updateOrderStatus(orderId, statusValue);
        toast.success('Status updated');
      }
      fetchOrders();
    } catch (error) {
      toast.error(error.message || 'Action failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-[#2C1810]">Pre-Orders Management</h1>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-[#E8DDD4] grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-[#6B4F3A] mb-1">Search</label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            placeholder="Order # or Customer"
            className="w-full px-3 py-2 border border-[#E8DDD4] rounded-lg focus:ring-2 focus:ring-[#9B2335] focus:border-transparent text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#6B4F3A] mb-1">Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="w-full px-3 py-2 border border-[#E8DDD4] rounded-lg focus:ring-2 focus:ring-[#9B2335] focus:border-transparent text-sm"
          >
            <option value="">All Statuses</option>
            {Object.entries(ORDER_STATUSES).map(([key, value]) => (
              <option key={key} value={value}>{key.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
      </div>

      <OrderTable 
        orders={orders} 
        type="preorder"
        loading={loading} 
        onAction={handleAction} 
      />
    </div>
  );
};

export default AdminPreOrders;
