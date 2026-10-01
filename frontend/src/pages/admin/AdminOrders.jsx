import React, { useState, useEffect } from 'react';
import * as adminApi from '../../api/admin';
import OrderTable from '../../components/admin/OrderTable';
import { ORDER_STATUSES } from '../../utils/constants';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    search: '',
    page: 1,
    limit: 50
  });
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getOrders(filters);
      setOrders(res.data.orders);
      setTotalPages(res.data.pages);
    } catch (error) {
      toast.error('Failed to load orders');
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
        toast.success('Order accepted');
      } else if (action === 'reject') {
        const reason = window.prompt('Enter reason for rejection (optional):');
        if (reason !== null) { // if not cancelled
          await adminApi.updateOrderStatus(orderId, ORDER_STATUSES.REJECTED);
          toast.success('Order rejected');
        }
      } else if (action === 'verify_payment') {
        await adminApi.verifyPayment(orderId, { status: 'verified' });
        toast.success('Payment verified successfully');
      } else if (action === 'update_status' && statusValue) {
        await adminApi.updateOrderStatus(orderId, statusValue);
        toast.success('Status updated');
      }
      fetchOrders();
    } catch (error) {
      toast.error(error.message || 'Action failed');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-[#2C1810]">Orders Management</h1>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-[#E8DDD4] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-medium text-[#6B4F3A] mb-1">Search</label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Order # or Customer Name"
            className="w-full px-3 py-2 border border-[#E8DDD4] rounded-lg focus:ring-2 focus:ring-[#9B2335] focus:border-transparent text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#6B4F3A] mb-1">Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-[#E8DDD4] rounded-lg focus:ring-2 focus:ring-[#9B2335] focus:border-transparent text-sm"
          >
            <option value="">All Statuses</option>
            {Object.entries(ORDER_STATUSES).map(([key, value]) => (
              <option key={key} value={value}>{key.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#6B4F3A] mb-1">Order Type</label>
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-[#E8DDD4] rounded-lg focus:ring-2 focus:ring-[#9B2335] focus:border-transparent text-sm"
          >
            <option value="">All Types</option>
            <option value="normal">Normal</option>
            <option value="preorder">Pre-order</option>
          </select>
        </div>
      </div>

      <OrderTable 
        orders={orders} 
        loading={loading} 
        onAction={handleAction} 
      />

      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <button
            disabled={filters.page === 1}
            onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
            className="px-4 py-2 border border-[#E8DDD4] rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-[#6B4F3A]">
            Page {filters.page} of {totalPages}
          </span>
          <button
            disabled={filters.page === totalPages}
            onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
            className="px-4 py-2 border border-[#E8DDD4] rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
