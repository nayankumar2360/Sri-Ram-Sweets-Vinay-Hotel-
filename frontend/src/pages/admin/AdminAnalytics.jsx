import React, { useState, useEffect } from 'react';
import * as adminApi from '../../api/admin';
import Loading from '../../components/common/Loading';
import StatsCard from '../../components/admin/StatsCard';
import { formatPrice } from '../../utils/formatters';
import toast from 'react-hot-toast';
import { 
  HiCurrencyRupee, 
  HiShoppingBag, 
  HiCheckCircle, 
  HiSparkles,
  HiFire,
  HiCalendarDays
} from 'react-icons/hi2';

const AdminAnalytics = () => {
  const [period, setPeriod] = useState('all');
  const [summary, setSummary] = useState(null);
  const [popularProducts, setPopularProducts] = useState([]);
  const [festivalDemand, setFestivalDemand] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [summaryRes, prodRes, festRes] = await Promise.all([
        adminApi.getAnalytics(period),
        adminApi.getProductAnalytics(),
        adminApi.getFestivalAnalytics()
      ]);
      setSummary(summaryRes.data?.data || summaryRes.data || {});
      setPopularProducts(prodRes.data?.data || prodRes.data || []);
      setFestivalDemand(festRes.data?.data || festRes.data || []);
    } catch (error) {
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  if (loading) return <div className="py-12"><Loading /></div>;

  // Group festival demand by festival name
  const festivalsGrouped = {};
  festivalDemand.forEach(item => {
    const festName = item._id?.festival || 'Unspecified Festival';
    const prodName = item._id?.product || 'Mithai';
    if (!festivalsGrouped[festName]) {
      festivalsGrouped[festName] = [];
    }
    festivalsGrouped[festName].push({
      product: prodName,
      quantity: item.totalQuantity
    });
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2C1810]">Sales & Demand Analytics</h1>
          <p className="text-sm text-[#6B4F3A]">Real-time visibility into revenue, customer demand, and festival production planning</p>
        </div>

        {/* Period Selector */}
        <div className="flex bg-white p-1 rounded-xl border border-[#E8DDD4] shadow-sm">
          {['today', 'week', 'month', 'all'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                period === p 
                  ? 'bg-[#9B2335] text-white' 
                  : 'text-[#6B4F3A] hover:bg-gray-100'
              }`}
            >
              {p === 'all' ? 'All Time' : p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Orders" 
          value={summary?.totalOrders ?? 0} 
          icon={HiShoppingBag} 
          color="#3B82F6"
        />
        <StatsCard 
          title="Completed Orders" 
          value={summary?.completedOrders ?? 0} 
          icon={HiCheckCircle} 
          color="#15803D"
        />
        <StatsCard 
          title="Direct Sales Revenue" 
          value={formatPrice(summary?.totalRevenue ?? 0)} 
          icon={HiCurrencyRupee} 
          color="#D4A017"
        />
        <StatsCard 
          title="Avg. Order Value" 
          value={formatPrice(Math.round(summary?.averageOrderValue ?? 0))} 
          icon={HiSparkles} 
          color="#E8742A"
        />
      </div>

      {/* Festival Demand Planning Section (Key Requirement #21) */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E8DDD4] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#E8DDD4] pb-3">
          <div className="flex items-center space-x-2 text-[#9B2335]">
            <HiCalendarDays className="w-5 h-5 text-[#D4A017]" />
            <h2 className="font-bold text-lg text-[#2C1810]">Festival Pre-Order Demand Planner</h2>
          </div>
          <span className="text-xs font-medium text-[#15803D] bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
            Helps estimate kitchen batch production before festivals
          </span>
        </div>

        {Object.keys(festivalsGrouped).length === 0 ? (
          <div className="p-8 text-center bg-[#FFF9F0] rounded-xl border border-dashed border-[#E8DDD4]">
            <p className="text-sm text-[#6B4F3A]">No festival pre-orders placed yet. As customers book for Diwali, Holi, or Chhath, aggregated demand will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(festivalsGrouped).map(([fest, items]) => {
              const totalKg = items.reduce((sum, i) => sum + i.quantity, 0);
              return (
                <div key={fest} className="bg-[#FFF9F0] border border-[#D4A017] rounded-xl p-5 shadow-sm space-y-3">
                  <div className="flex justify-between items-center border-b border-[#E8DDD4] pb-2">
                    <h3 className="font-bold text-[#9B2335] text-base">{fest}</h3>
                    <span className="text-xs font-bold text-[#6B4F3A] bg-white px-2.5 py-1 rounded-md border border-[#E8DDD4]">
                      Total: {totalKg} Units/kg
                    </span>
                  </div>
                  <div className="divide-y divide-[#E8DDD4]">
                    {items.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2 text-sm">
                        <span className="font-medium text-[#2C1810]">{it.product}</span>
                        <span className="font-bold text-[#9B2335]">{it.quantity} booked</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Popular Products Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E8DDD4] p-6 space-y-4">
        <div className="flex items-center space-x-2 text-[#9B2335] border-b border-[#E8DDD4] pb-3">
          <HiFire className="w-5 h-5 text-[#E8742A]" />
          <h2 className="font-bold text-lg text-[#2C1810]">Top Selling Specialties</h2>
        </div>

        {popularProducts.length === 0 ? (
          <div className="p-6 text-center text-[#6B4F3A] text-sm">No sales data recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FFF9F0] text-xs font-semibold text-[#6B4F3A] border-b border-[#E8DDD4]">
                  <th className="p-3">Rank</th>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Total Sold</th>
                  <th className="p-3">Total Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DDD4] text-sm">
                {popularProducts.map((p, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-3 font-bold text-[#6B4F3A]">#{idx + 1}</td>
                    <td className="p-3 font-semibold text-[#2C1810]">{p._id || 'Specialty Item'}</td>
                    <td className="p-3 font-medium text-[#9B2335]">{p.totalQuantity} sold</td>
                    <td className="p-3 font-bold text-[#15803D]">{formatPrice(p.totalRevenue || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAnalytics;
