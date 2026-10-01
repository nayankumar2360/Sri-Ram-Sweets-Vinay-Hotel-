import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as adminApi from '../../api/admin';
import Loading from '../../components/common/Loading';
import { formatPrice, formatDateTime, getStatusColor, formatOrderStatus, formatPaymentStatus } from '../../utils/formatters';
import { ORDER_STATUSES } from '../../utils/constants';
import toast from 'react-hot-toast';

const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const res = await adminApi.getOrderById(id);
      setOrder(res.data);
    } catch (error) {
      toast.error('Failed to load order details');
      navigate('/admin/orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleUpdateStatus = async (status) => {
    try {
      await adminApi.updateOrderStatus(id, status);
      toast.success(`Order marked as ${formatOrderStatus(status)}`);
      fetchOrder();
    } catch (error) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const handleVerifyPayment = async (status, reason = '') => {
    try {
      await adminApi.verifyPayment(id, { status, reason });
      toast.success(status === 'verified' ? 'Payment verified successfully' : 'Payment rejected');
      fetchOrder();
    } catch (error) {
      toast.error(error.message || 'Failed to verify payment');
    }
  };

  if (loading) return <div className="py-12"><Loading /></div>;
  if (!order) return null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2C1810]">Order #{order.orderNumber}</h1>
          <p className="text-[#6B4F3A]">{formatDateTime(order.createdAt)} • {order.orderType === 'preorder' ? 'Pre-order' : 'Normal Order'}</p>
        </div>
        <div className="flex space-x-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
            {formatOrderStatus(order.status)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-sm border border-[#E8DDD4] overflow-hidden">
            <div className="p-4 border-b border-[#E8DDD4] bg-gray-50">
              <h2 className="font-bold text-[#2C1810]">Order Items</h2>
            </div>
            <div className="p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[#6B4F3A] border-b border-gray-100">
                    <th className="text-left pb-2 font-medium">Item</th>
                    <th className="text-center pb-2 font-medium">Qty</th>
                    <th className="text-right pb-2 font-medium">Price</th>
                    <th className="text-right pb-2 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-3">
                        <p className="font-medium text-[#2C1810]">{item.product?.name || 'Unknown Product'}</p>
                      </td>
                      <td className="py-3 text-center">{item.quantity}</td>
                      <td className="py-3 text-right">{formatPrice(item.price)}</td>
                      <td className="py-3 text-right font-medium">{formatPrice(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between text-[#6B4F3A]">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.totalAmount - (order.deliveryCharge || 0))}</span>
                </div>
                {order.deliveryCharge > 0 && (
                  <div className="flex justify-between text-[#6B4F3A]">
                    <span>Delivery Charge</span>
                    <span>{formatPrice(order.deliveryCharge)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg text-[#2C1810] pt-2 border-t border-gray-100 mt-2">
                  <span>Grand Total</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-[#E8DDD4] p-6 space-y-4">
            <h2 className="font-bold text-[#2C1810] mb-4">Actions</h2>
            
            <div className="flex flex-wrap gap-3">
              {order.status === 'placed' && (
                <>
                  <button onClick={() => handleUpdateStatus(ORDER_STATUSES.ACCEPTED)} className="px-4 py-2 bg-[#15803D] text-white rounded-lg hover:bg-green-700">Accept Order</button>
                  <button onClick={() => {
                    const reason = prompt('Reason for rejection:');
                    if (reason !== null) handleUpdateStatus(ORDER_STATUSES.REJECTED);
                  }} className="px-4 py-2 bg-[#DC2626] text-white rounded-lg hover:bg-red-700">Reject Order</button>
                </>
              )}
              {order.status === 'accepted' && (
                <button onClick={() => handleUpdateStatus(ORDER_STATUSES.CONFIRMED)} className="px-4 py-2 bg-[#9B2335] text-white rounded-lg hover:bg-[#7A1B29]">Mark Confirmed</button>
              )}
              {order.status === 'confirmed' && (
                <button onClick={() => handleUpdateStatus(ORDER_STATUSES.PREPARING)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Start Preparing</button>
              )}
              {order.status === 'preparing' && (
                <button onClick={() => handleUpdateStatus(ORDER_STATUSES.READY)} className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">Mark Ready</button>
              )}
              {order.status === 'ready' && order.fulfillmentType === 'delivery' && (
                <button onClick={() => handleUpdateStatus(ORDER_STATUSES.OUT_FOR_DELIVERY)} className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">Out for Delivery</button>
              )}
              {(order.status === 'ready' || order.status === 'out_for_delivery') && (
                <button onClick={() => handleUpdateStatus(ORDER_STATUSES.COMPLETED)} className="px-4 py-2 bg-[#15803D] text-white rounded-lg hover:bg-green-700">Mark Completed</button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl shadow-sm border border-[#E8DDD4] p-4">
            <h2 className="font-bold text-[#2C1810] mb-3">Customer Details</h2>
            <p className="font-medium text-[#2C1810]">{order.customer?.name}</p>
            <p className="text-[#6B4F3A]">{order.customer?.phone}</p>
            {order.fulfillmentType === 'delivery' && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <h3 className="text-xs font-semibold text-[#6B4F3A] uppercase mb-1">Delivery Address</h3>
                <p className="text-sm text-[#2C1810]">
                  {order.deliveryAddress?.street}<br/>
                  {order.deliveryAddress?.city}, {order.deliveryAddress?.state} {order.deliveryAddress?.pincode}
                </p>
              </div>
            )}
            {order.fulfillmentType === 'pickup' && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">Store Pickup</span>
              </div>
            )}
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl shadow-sm border border-[#E8DDD4] p-4">
            <h2 className="font-bold text-[#2C1810] mb-3">Payment Info</h2>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[#6B4F3A] text-sm">Status</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.paymentStatus)}`}>
                {formatPaymentStatus(order.paymentStatus)}
              </span>
            </div>
            
            {order.paymentDetails?.transactionId && (
              <div className="mb-3 text-sm">
                <span className="block text-[#6B4F3A] text-xs">Transaction ID</span>
                <span className="font-medium text-[#2C1810] break-all">{order.paymentDetails.transactionId}</span>
              </div>
            )}

            {order.paymentDetails?.screenshotUrl && (
              <div className="mb-4">
                <span className="block text-[#6B4F3A] text-xs mb-1">Screenshot</span>
                <a href={order.paymentDetails.screenshotUrl} target="_blank" rel="noreferrer">
                  <img src={order.paymentDetails.screenshotUrl} alt="Payment" className="w-full h-32 object-cover rounded border" />
                </a>
              </div>
            )}

            {order.paymentStatus === 'submitted' && (
              <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => handleVerifyPayment('verified')}
                  className="flex-1 px-3 py-2 bg-[#15803D] text-white rounded text-sm font-medium hover:bg-green-700"
                >
                  Verify
                </button>
                <button 
                  onClick={() => {
                    const reason = prompt('Reason for rejection:');
                    if (reason !== null) handleVerifyPayment('failed', reason);
                  }}
                  className="flex-1 px-3 py-2 bg-[#DC2626] text-white rounded text-sm font-medium hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
