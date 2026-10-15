import React, { useState, useEffect } from 'react';
import * as adminApi from '../../api/admin';
import { BULK_ORDER_STATUSES, BULK_ORDER_STATUS_LABELS } from '../../utils/constants';
import Loading from '../../components/common/Loading';
import { formatDateTime, formatPrice, getStatusColor } from '../../utils/formatters';
import toast from 'react-hot-toast';
import { HiXMark } from 'react-icons/hi2';

const BulkOrderDetailModal = ({ order, onClose, onSave }) => {
  const [status, setStatus] = useState(order.status || 'requested');
  const [quotedAmount, setQuotedAmount] = useState(order.quotedAmount || '');
  const [ownerNotes, setOwnerNotes] = useState(order.ownerNotes || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.updateBulkOrderStatus(order._id, {
        status,
        quotedAmount: quotedAmount ? Number(quotedAmount) : undefined,
        ownerNotes
      });
      toast.success('Bulk order updated');
      onSave();
    } catch (error) {
      toast.error(error.message || 'Failed to update bulk order');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-[#E8DDD4] flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-[#2C1810]">
              Bulk Order {order.bulkOrderNumber ? `#${order.bulkOrderNumber}` : 'Details'}
            </h2>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${getStatusColor(order.status)}`}>
              {BULK_ORDER_STATUS_LABELS[order.status] || order.status}
            </span>
          </div>
          <button onClick={onClose} className="p-2 text-[#6B4F3A] hover:bg-gray-100 rounded-full transition-colors">
            <HiXMark className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#FFF9F0] rounded-lg p-4 border border-[#E8DDD4]">
              <h3 className="text-xs font-semibold text-[#6B4F3A] uppercase mb-2">Customer</h3>
              <p className="font-medium text-[#2C1810]">{order.customerName || order.customer?.name}</p>
              <p className="text-sm text-[#6B4F3A]">{order.customerPhone || order.customer?.phone}</p>
            </div>
            <div className="bg-[#FFF9F0] rounded-lg p-4 border border-[#E8DDD4]">
              <h3 className="text-xs font-semibold text-[#6B4F3A] uppercase mb-2">Event Details</h3>
              <p className="font-medium text-[#2C1810] capitalize">{order.eventType?.replace('_', ' ')}</p>
              <p className="text-sm text-[#6B4F3A]">
                {new Date(order.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                {order.requiredTime && ` at ${order.requiredTime}`}
              </p>
              {order.guestCount && (
                <p className="text-sm text-[#6B4F3A]">{order.guestCount} guests</p>
              )}
            </div>
          </div>

          {/* Fulfillment & Address */}
          {order.fulfillmentType && (
            <div className="bg-[#FFF9F0] rounded-lg p-4 border border-[#E8DDD4]">
              <h3 className="text-xs font-semibold text-[#6B4F3A] uppercase mb-2">
                Fulfillment: <span className="capitalize">{order.fulfillmentType}</span>
              </h3>
              {order.fulfillmentType === 'delivery' && order.deliveryAddress && (
                <p className="text-sm text-[#2C1810]">
                  {order.deliveryAddress.street}{order.deliveryAddress.city ? `, ${order.deliveryAddress.city}` : ''}
                  {order.deliveryAddress.state ? `, ${order.deliveryAddress.state}` : ''}
                  {order.deliveryAddress.pincode ? ` - ${order.deliveryAddress.pincode}` : ''}
                </p>
              )}
            </div>
          )}

          {/* Requested Items */}
          <div>
            <h3 className="text-sm font-bold text-[#2C1810] mb-2">Requested Items</h3>
            {order.items && order.items.length > 0 ? (
              <div className="bg-white rounded-lg border border-[#E8DDD4] overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-[#FFF9F0] border-b border-[#E8DDD4] text-xs text-[#6B4F3A]">
                      <th className="p-3 font-semibold">Item</th>
                      <th className="p-3 font-semibold text-center">Quantity</th>
                      <th className="p-3 font-semibold">Unit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DDD4]">
                    {order.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="p-3 font-medium text-[#2C1810]">{item.name || item.product?.name || 'Item'}</td>
                        <td className="p-3 text-center font-medium text-[#9B2335]">{item.quantity}</td>
                        <td className="p-3 text-[#6B4F3A]">{item.unit || 'kg'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-[#6B4F3A] italic">No specific items listed.</p>
            )}
          </div>

          {/* Requirements & Notes */}
          {order.requirements && (
            <div>
              <h3 className="text-sm font-bold text-[#2C1810] mb-1">Special Requirements</h3>
              <p className="text-sm text-[#6B4F3A] bg-[#FFF9F0] rounded-lg p-3 border border-[#E8DDD4]">{order.requirements}</p>
            </div>
          )}

          {order.notes && (
            <div>
              <h3 className="text-sm font-bold text-[#2C1810] mb-1">Customer Notes</h3>
              <p className="text-sm text-[#6B4F3A] bg-[#FFF9F0] rounded-lg p-3 border border-[#E8DDD4]">{order.notes}</p>
            </div>
          )}

          {/* Budget */}
          {order.estimatedBudget > 0 && (
            <div className="bg-[#FFF9F0] rounded-lg p-4 border border-[#E8DDD4]">
              <h3 className="text-xs font-semibold text-[#6B4F3A] uppercase mb-1">Customer's Estimated Budget</h3>
              <p className="text-lg font-bold text-[#15803D]">{formatPrice(order.estimatedBudget)}</p>
            </div>
          )}

          {/* Owner Quotation Section */}
          <div className="border-t border-[#E8DDD4] pt-4 space-y-4">
            <h3 className="text-sm font-bold text-[#9B2335] uppercase">Owner Response</h3>

            <div>
              <label className="block text-xs font-semibold text-[#6B4F3A] mb-1">Update Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-[#E8DDD4] rounded-lg focus:ring-2 focus:ring-[#9B2335] focus:border-transparent text-sm"
              >
                {Object.entries(BULK_ORDER_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B4F3A] mb-1">Quoted Amount (₹)</label>
              <input
                type="number"
                value={quotedAmount}
                onChange={(e) => setQuotedAmount(e.target.value)}
                placeholder="Enter your quoted price..."
                className="w-full px-3 py-2 border border-[#E8DDD4] rounded-lg focus:ring-2 focus:ring-[#9B2335] focus:border-transparent text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B4F3A] mb-1">Owner Notes</label>
              <textarea
                rows="3"
                value={ownerNotes}
                onChange={(e) => setOwnerNotes(e.target.value)}
                placeholder="Internal notes or message to customer..."
                className="w-full px-3 py-2 border border-[#E8DDD4] rounded-lg focus:ring-2 focus:ring-[#9B2335] focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-[#E8DDD4]">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#E8DDD4] text-[#6B4F3A] rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 bg-[#9B2335] text-white rounded-lg hover:bg-[#7A1B29] transition-colors disabled:opacity-50 text-sm font-medium"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminBulkOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

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
                <tr 
                  key={order._id} 
                  className="hover:bg-gray-50 text-sm cursor-pointer transition-colors"
                  onClick={() => setSelectedOrder(order)}
                >
                  <td className="p-4">
                    <p className="font-medium text-[#2C1810]">{order.customer?.name}</p>
                    <p className="text-xs text-[#6B4F3A]">{order.customer?.phone}</p>
                  </td>
                  <td className="p-4 capitalize">{order.eventType?.replace('_', ' ')}</td>
                  <td className="p-4">
                    <p>{new Date(order.eventDate).toLocaleDateString()}</p>
                    <p className="text-xs text-[#6B4F3A]">{order.guestCount} guests</p>
                  </td>
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      className="text-xs border border-[#E8DDD4] rounded p-1 focus:ring-[#9B2335] bg-white"
                    >
                      {Object.entries(BULK_ORDER_STATUS_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
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

      {selectedOrder && (
        <BulkOrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onSave={() => {
            setSelectedOrder(null);
            fetchOrders();
          }}
        />
      )}
    </div>
  );
};

export default AdminBulkOrders;
