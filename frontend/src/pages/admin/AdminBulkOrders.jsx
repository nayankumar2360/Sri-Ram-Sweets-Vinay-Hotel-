import React, { useState, useEffect } from 'react';
import * as adminApi from '../../api/admin';
import { BULK_ORDER_STATUSES } from '../../utils/constants';
import Loading from '../../components/common/Loading';
import { formatDateTime, getStatusColor } from '../../utils/formatters';
import toast from 'react-hot-toast';

const AdminBulkOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getBulkOrders();
      const list = res.data?.data || res.data || [];
      setOrders(Array.isArray(list) ? list : []);
    } catch (error) {
      toast.error('Failed to load bulk orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await adminApi.updateBulkOrderStatus(id, status);
      toast.success('Status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#2C1810]">Bulk Orders</h1>
      
      {loading ? <Loading /> : (
        <div className="bg-white rounded-xl shadow-sm border border-[#E8DDD4] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FFF9F0] border-b border-[#E8DDD4] text-sm text-[#6B4F3A]">
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Event Type</th>
                <th className="p-4 font-semibold">Date & Guests</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Requested On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DDD4]">
              {orders.map(order => (
                <tr key={order._id} className="hover:bg-gray-50 text-sm">
                  <td className="p-4">
                    <p className="font-medium text-[#2C1810]">{order.customer?.name}</p>
                    <p className="text-xs text-[#6B4F3A]">{order.customer?.phone}</p>
                  </td>
                  <td className="p-4 capitalize">{order.eventType}</td>
                  <td className="p-4">
                    <p>{new Date(order.eventDate).toLocaleDateString()}</p>
                    <p className="text-xs text-[#6B4F3A]">{order.guestCount} guests</p>
                  </td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      className="text-xs border border-[#E8DDD4] rounded p-1 focus:ring-[#9B2335] bg-white"
                    >
                      {Object.entries(BULK_ORDER_STATUSES).map(([key, value]) => (
                        <option key={key} value={value}>{key}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 text-[#6B4F3A]">{formatDateTime(order.createdAt)}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan="5" className="p-8 text-center text-[#6B4F3A]">No bulk orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminBulkOrders;
