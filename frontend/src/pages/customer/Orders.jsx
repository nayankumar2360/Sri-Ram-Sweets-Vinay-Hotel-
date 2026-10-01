import React, { useEffect, useState } from 'react';
import { getOrders } from '../../api/orders';
import { getPreOrders } from '../../api/preOrders';
import { getBulkOrders } from '../../api/bulkOrders';
import OrderCard from '../../components/order/OrderCard';
import Loading from '../../components/common/Loading';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [preOrders, setPreOrders] = useState([]);
  const [bulkOrders, setBulkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('regular'); // regular, pre, bulk

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const [ordersRes, preOrdersRes, bulkOrdersRes] = await Promise.all([
          getOrders().catch(() => ({ data: [] })),
          getPreOrders().catch(() => ({ data: [] })),
          getBulkOrders().catch(() => ({ data: [] }))
        ]);
        
        const extractArray = (res) => {
          const d = res?.data?.data || res?.data || [];
          return Array.isArray(d) ? d : [];
        };
        const oList = extractArray(ordersRes);
        const pList = extractArray(preOrdersRes);
        const bList = extractArray(bulkOrdersRes);

        // Sort by newest
        setOrders(oList.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
        setPreOrders(pList.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
        setBulkOrders(bList.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (error) {
        console.error('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchAllOrders();
  }, []);

  if (loading) return <Loading />;

  const getActiveOrders = () => {
    if (activeTab === 'regular') return orders;
    if (activeTab === 'pre') return preOrders;
    if (activeTab === 'bulk') return bulkOrders;
    return [];
  };

  const activeOrdersList = getActiveOrders();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-primary font-serif mb-6">Your Orders</h1>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-border mb-6">
        <button
          onClick={() => setActiveTab('regular')}
          className={`py-2 px-4 font-medium text-sm focus:outline-none ${activeTab === 'regular' ? 'border-b-2 border-primary text-primary' : 'text-text-secondary hover:text-primary'}`}
        >
          Regular Orders
        </button>
        <button
          onClick={() => setActiveTab('pre')}
          className={`py-2 px-4 font-medium text-sm focus:outline-none ${activeTab === 'pre' ? 'border-b-2 border-primary text-primary' : 'text-text-secondary hover:text-primary'}`}
        >
          Festival Pre-Orders
        </button>
        <button
          onClick={() => setActiveTab('bulk')}
          className={`py-2 px-4 font-medium text-sm focus:outline-none ${activeTab === 'bulk' ? 'border-b-2 border-primary text-primary' : 'text-text-secondary hover:text-primary'}`}
        >
          Bulk Orders
        </button>
      </div>

      {activeOrdersList.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-border">
          <p className="text-text-secondary">No orders found in this category.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeOrdersList.map(order => (
            <OrderCard 
              key={order._id} 
              order={order} 
              isPreOrder={activeTab === 'pre'} 
              isBulkOrder={activeTab === 'bulk'} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
