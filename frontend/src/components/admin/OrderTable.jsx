import React from 'react';
import { formatPrice, formatDateTime, getStatusColor, formatOrderStatus, formatPaymentStatus } from '../../utils/formatters';
import { ORDER_STATUSES } from '../../utils/constants';
import Loading from '../common/Loading';
import { Link } from 'react-router-dom';

const OrderTable = ({ orders, type = 'order', onAction, loading }) => {
  if (loading) {
    return <div className="py-8"><Loading /></div>;
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-[#E8DDD4]">
        <p className="text-[#6B4F3A]">No orders found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#E8DDD4] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FFF9F0] border-b border-[#E8DDD4] text-sm text-[#6B4F3A]">
              <th className="p-4 font-semibold">Order #</th>
              <th className="p-4 font-semibold">Customer</th>
              <th className="p-4 font-semibold">Items</th>
              <th className="p-4 font-semibold">Amount</th>
              <th className="p-4 font-semibold">Payment Status</th>
              <th className="p-4 font-semibold">Order Status</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8DDD4]">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50 transition-colors text-sm">
                <td className="p-4">
                  <Link to={`/admin/orders/${order._id}`} className="font-medium text-[#9B2335] hover:underline">
                    #{order.orderNumber}
                  </Link>
                </td>
                <td className="p-4">
                  <p className="font-medium text-[#2C1810]">{order.customer?.name}</p>
                  <p className="text-xs text-[#6B4F3A]">{order.customer?.phone}</p>
                </td>
                <td className="p-4">
                  <div className="max-w-[200px] truncate">
                    {order.items?.map(i => `${i.quantity}x ${i.product?.name}`).join(', ')}
                  </div>
                </td>
                <td className="p-4 font-medium">
                  {formatPrice(order.totalAmount)}
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.paymentStatus)}`}>
                    {formatPaymentStatus(order.paymentStatus)}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {formatOrderStatus(order.status)}
                  </span>
                </td>
                <td className="p-4 text-[#6B4F3A]">
                  {formatDateTime(order.createdAt)}
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    {order.status === 'placed' && (
                      <>
                        <button
                          onClick={() => onAction('accept', order._id)}
                          className="px-3 py-1 bg-[#15803D] text-white rounded hover:bg-green-700 transition-colors text-xs font-medium"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => onAction('reject', order._id)}
                          className="px-3 py-1 bg-[#DC2626] text-white rounded hover:bg-red-700 transition-colors text-xs font-medium"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {order.paymentStatus === 'submitted' && (
                      <button
                        onClick={() => onAction('verify_payment', order._id)}
                        className="px-3 py-1 bg-[#F59E0B] text-white rounded hover:bg-yellow-600 transition-colors text-xs font-medium"
                      >
                        Verify Payment
                      </button>
                    )}
                    <select
                      className="text-xs border border-[#E8DDD4] rounded p-1 focus:ring-[#9B2335] focus:border-[#9B2335]"
                      value={order.status}
                      onChange={(e) => onAction('update_status', order._id, e.target.value)}
                    >
                      {Object.entries(ORDER_STATUSES).map(([key, value]) => (
                        <option key={key} value={value}>{formatOrderStatus(value)}</option>
                      ))}
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;
