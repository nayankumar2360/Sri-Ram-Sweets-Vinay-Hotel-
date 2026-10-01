import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as adminApi from '../../api/admin';
import StatsCard from '../../components/admin/StatsCard';
import Loading from '../../components/common/Loading';
import { formatPrice, formatDateTime, getStatusColor, formatOrderStatus } from '../../utils/formatters';
import toast from 'react-hot-toast';
import { 
  HiShoppingBag, 
  HiClock, 
  HiCalendarDays, 
  HiCube, 
  HiCheckCircle, 
  HiExclamationCircle,
  HiCurrencyRupee,
  HiBanknotes
} from 'react-icons/hi2';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, ordersRes] = await Promise.all([
        adminApi.getDashboardStats(),
        adminApi.getOrders({ limit: 10 })
      ]);
      setStats(statsRes.data?.data || statsRes.data || {});
      const recOrders = ordersRes.data?.orders || ordersRes.data?.data || ordersRes.data || [];
      setRecentOrders(Array.isArray(recOrders) ? recOrders : []);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // auto refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="flex h-full items-center justify-center"><Loading /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-[#2C1810]">Dashboard Overview</h1>
        <div className="flex space-x-3">
          <Link to="/admin/orders" className="px-4 py-2 bg-white border border-[#E8DDD4] text-[#6B4F3A] rounded-lg hover:bg-gray-50 text-sm font-medium shadow-sm">
            View All Orders
          </Link>
          <Link to="/admin/menu" className="px-4 py-2 bg-[#9B2335] text-white rounded-lg hover:bg-[#7A1B29] text-sm font-medium shadow-sm">
            Manage Menu
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Today's Orders" value={stats?.todayOrders || 0} icon={HiShoppingBag} color="border-blue-500" />
        <StatsCard title="Pending Orders" value={stats?.pendingOrders || 0} icon={HiClock} color="border-yellow-500" />
        <StatsCard title="Active Pre-Orders" value={stats?.activePreOrders || 0} icon={HiCalendarDays} color="border-purple-500" />
        <StatsCard title="Pending Bulk Orders" value={stats?.pendingBulkOrders || 0} icon={HiCube} color="border-orange-500" />
        <StatsCard title="Completed Today" value={stats?.completedToday || 0} icon={HiCheckCircle} color="border-green-500" />
        <StatsCard title="Pending Payments" value={stats?.pendingPayments || 0} icon={HiExclamationCircle} color="border-red-500" />
        <StatsCard title="Today's Revenue" value={formatPrice(stats?.todayRevenue || 0)} icon={HiCurrencyRupee} color="border-emerald-500" />
        <StatsCard title="Total Revenue" value={formatPrice(stats?.totalRevenue || 0)} icon={HiBanknotes} color="border-yellow-600" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#E8DDD4] overflow-hidden">
        <div className="p-6 border-b border-[#E8DDD4] flex justify-between items-center">
          <h2 className="text-lg font-bold text-[#2C1810]">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm font-medium text-[#9B2335] hover:underline">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FFF9F0] border-b border-[#E8DDD4] text-sm text-[#6B4F3A]">
                <th className="p-4 font-semibold">Order #</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DDD4]">
              {recentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors text-sm cursor-pointer" onClick={() => window.location.href = `/admin/orders/${order._id}`}>
                  <td className="p-4 font-medium text-[#9B2335]">#{order.orderNumber}</td>
                  <td className="p-4">
                    <p className="font-medium text-[#2C1810]">{order.customer?.name}</p>
                  </td>
                  <td className="p-4 font-medium">{formatPrice(order.totalAmount)}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {formatOrderStatus(order.status)}
                    </span>
                  </td>
                  <td className="p-4 text-[#6B4F3A]">{formatDateTime(order.createdAt)}</td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-[#6B4F3A]">No recent orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
