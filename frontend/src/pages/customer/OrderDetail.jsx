import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getOrder, submitPayment } from '../../api/orders';
import { getPreOrder, submitPreOrderPayment } from '../../api/preOrders';
import { getPublicSettings } from '../../api/products';
import OrderStatusTracker from '../../components/order/OrderStatusTracker';
import PaymentProof from '../../components/order/PaymentProof';
import Loading from '../../components/common/Loading';
import { formatPrice, formatDate, formatDateTime, getStatusColor, formatOrderStatus } from '../../utils/formatters';

const OrderDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const isPreOrder = location.pathname.includes('/pre-orders') || location.pathname.includes('pre-order'); // simple check, or trust API fallback
  
  const [order, setOrder] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actualIsPreOrder, setActualIsPreOrder] = useState(isPreOrder);

  const fetchOrder = async () => {
    try {
      let res;
      try {
        res = await getOrder(id);
        setActualIsPreOrder(false);
      } catch (err) {
        res = await getPreOrder(id);
        setActualIsPreOrder(true);
      }
      setOrder(res.data?.data || res.data);
      
      const setRes = await getPublicSettings();
      setSettings(setRes.data?.data || setRes.data);
    } catch (error) {
      console.error('Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handlePaymentSubmit = async (formData) => {
    if (actualIsPreOrder) {
      await submitPreOrderPayment(id, formData);
    } else {
      await submitPayment(id, formData);
    }
    await fetchOrder(); // Refresh data
  };

  if (loading) return <Loading />;
  if (!order) return <div className="text-center py-12">Order not found</div>;

  const showPaymentProof = order.orderStatus !== 'rejected' && order.orderStatus !== 'cancelled';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary font-serif">
          Order #{order.orderNumber || order._id.slice(-6).toUpperCase()}
        </h1>
        {actualIsPreOrder && (
          <span className="bg-secondary-light text-text-primary px-3 py-1 rounded-full text-sm font-bold">
            Pre-Order
          </span>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-border p-6 mb-8">
        <OrderStatusTracker currentStatus={order.orderStatus} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-2 bg-white rounded-lg shadow-sm border border-border p-6">
          <h3 className="text-lg font-semibold border-b border-border pb-2 mb-4">Items</h3>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex-1">
                  <p className="font-medium">{item.product?.name || 'Product'}</p>
                  <p className="text-sm text-text-secondary">
                    {formatPrice(item.price)} x {item.quantity}
                  </p>
                </div>
                <div className="font-semibold">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t border-border mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-text-secondary">
              <span>Subtotal</span>
              <span>{formatPrice(order.totalAmount - (order.deliveryCharge || 0))}</span>
            </div>
            {order.deliveryCharge > 0 && (
              <div className="flex justify-between text-text-secondary">
                <span>Delivery Charge</span>
                <span>{formatPrice(order.deliveryCharge)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg text-primary pt-2">
              <span>Total</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-border p-6">
            <h3 className="text-lg font-semibold border-b border-border pb-2 mb-4">Order Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-text-secondary">Date Placed</p>
                <p className="font-medium">{formatDateTime(order.createdAt)}</p>
              </div>
              <div>
                <p className="text-text-secondary">Status</p>
                <p className={`inline-block px-2 py-1 rounded text-xs font-bold mt-1 ${getStatusColor(order.orderStatus)}`}>
                  {formatOrderStatus(order.orderStatus)}
                </p>
              </div>
              <div>
                <p className="text-text-secondary">Fulfillment</p>
                <p className="font-medium capitalize">{order.fulfillmentType}</p>
                {order.fulfillmentType === 'delivery' && order.deliveryAddress && (
                  <p className="text-text-secondary mt-1">
                    {order.deliveryAddress.street}, {order.deliveryAddress.city} - {order.deliveryAddress.pincode}
                  </p>
                )}
              </div>
              {actualIsPreOrder && (
                <div>
                  <p className="text-text-secondary">Scheduled Date</p>
                  <p className="font-medium text-accent">{formatDate(order.scheduledDate)} at {order.scheduledTime}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showPaymentProof && settings?.upiId && (
        <PaymentProof
          orderId={order._id}
          upiId={settings.upiId}
          upiName={settings.upiName || 'Sri Ram Sweets(Vinay Hotel)'}
          amount={order.grandTotal || order.totalAmount}
          status={order.paymentStatus}
          onSubmit={handlePaymentSubmit}
        />
      )}
    </div>
  );
};

export default OrderDetail;
