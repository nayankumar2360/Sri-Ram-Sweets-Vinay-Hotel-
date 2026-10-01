import React, { useState, useEffect } from 'react';
import * as adminApi from '../../api/admin';
import Loading from '../../components/common/Loading';
import { formatPrice, formatDateTime } from '../../utils/formatters';
import toast from 'react-hot-toast';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await adminApi.getCustomers();
        const list = res.data?.data || res.data || [];
        setCustomers(Array.isArray(list) ? list : []);
      } catch (error) {
        toast.error('Failed to load customers');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#2C1810]">Customers</h1>
      
      {loading ? <Loading /> : (
        <div className="bg-white rounded-xl shadow-sm border border-[#E8DDD4] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FFF9F0] border-b border-[#E8DDD4] text-sm text-[#6B4F3A]">
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Phone</th>
                <th className="p-4 font-semibold">Total Orders</th>
                <th className="p-4 font-semibold">Total Spent</th>
                <th className="p-4 font-semibold">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DDD4]">
              {customers.map(customer => (
                <tr key={customer._id} className="hover:bg-gray-50 text-sm">
                  <td className="p-4 font-medium text-[#2C1810]">{customer.name}</td>
                  <td className="p-4 text-[#6B4F3A]">{customer.phone}</td>
                  <td className="p-4">{customer.totalOrders || 0}</td>
                  <td className="p-4 text-[#15803D] font-medium">{formatPrice(customer.totalSpent || 0)}</td>
                  <td className="p-4 text-[#6B4F3A]">{formatDateTime(customer.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
