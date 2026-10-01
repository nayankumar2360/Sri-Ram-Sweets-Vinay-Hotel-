import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice, formatDate, formatOrderStatus, getStatusColor, formatPaymentStatus } from '../../utils/formatters';

const OrderCard = ({ order, isPreOrder = false, isBulkOrder = false }) => {
  const getLink = () => {
    // If it's a unified orders list, we can just use the order's id and a general route, 
    // or separate them based on props/types. For simplicity, we use /orders/:id for regular and pre-orders.
    if (isBulkOrder) return `/bulk-order/${order._id}`;
    return `/orders/${order._id}`;
  };

  const status = isBulkOrder ? order.status : order.orderStatus;

  return (
    <Link to={getLink()} className="block bg-white rounded-lg shadow-sm border border-border p-4 hover:shadow-md transition-shadow mb-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-text-primary">
              Order #{order.orderNumber || order._id.slice(-6).toUpperCase()}
            </h3>
            {isPreOrder && (
              <span className="text-xs bg-secondary-light text-text-primary px-2 py-0.5 rounded-full font-medium">
                Pre-Order
              </span>
            )}
            {isBulkOrder && (
              <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-medium">
                Bulk Order
              </span>
            )}
          </div>
          <p className="text-sm text-text-secondary mt-1">
            {formatDate(order.createdAt)}
          </p>
        </div>
        
        <div className="mt-2 sm:mt-0 flex flex-wrap gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {formatOrderStatus(status)}
          </span>
          {!isBulkOrder && (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.paymentStatus)}`}>
              Payment: {formatPaymentStatus(order.paymentStatus)}
            </span>
          )}
        </div>
      </div>

      <div className="border-t border-border pt-4 flex justify-between items-end">
        <div className="text-sm text-text-secondary max-w-[70%]">
          {!isBulkOrder ? (
            <p className="truncate">
              {order.items?.map(i => `${i.quantity}x ${i.product?.name || 'Item'}`).join(', ')}
            </p>
          ) : (
            <p>Event: {order.eventType} • {formatDate(order.eventDate)}</p>
          )}
          <p className="mt-1 capitalize">
            {order.fulfillmentType}
          </p>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-text-secondary">Total</p>
          <p className="font-bold text-primary">
            {formatPrice(order.totalAmount || order.estimatedBudget)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default OrderCard;
