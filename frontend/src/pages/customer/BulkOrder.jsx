import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBulkOrder } from '../../api/bulkOrders';
import { useAuth } from '../../hooks/useAuth';
import { EVENT_TYPES } from '../../utils/constants';
import toast from 'react-hot-toast';

const BulkOrder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    customerPhone: user?.phone || '',
    eventType: 'wedding',
    eventDate: '',
    eventTime: '',
    numberOfGuests: '',
    requirements: '',
    estimatedBudget: '',
    fulfillmentType: 'pickup'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const submitData = {
        ...formData,
        customerName: formData.customerName || user?.name || 'Customer',
        customerPhone: formData.customerPhone || user?.phone || '',
        guestCount: Number(formData.numberOfGuests) || 0,
        requiredTime: formData.eventTime,
        numberOfGuests: Number(formData.numberOfGuests),
        estimatedBudget: formData.estimatedBudget ? Number(formData.estimatedBudget) : undefined
      };
      
      const res = await createBulkOrder(submitData);
      toast.success('Bulk order request submitted! Our team will contact you soon.');
      navigate(`/orders`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary font-serif mb-2">Bulk & Event Orders</h1>
        <p className="text-text-secondary">Weddings, parties, and corporate events. We handle it all with authentic taste and premium quality.</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-border">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Event Type *</label>
              <select name="eventType" required value={formData.eventType} onChange={handleChange} className="w-full px-4 py-2 border border-border rounded-md">
                {EVENT_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Number of Guests *</label>
              <input type="number" name="numberOfGuests" required min="1" value={formData.numberOfGuests} onChange={handleChange} className="w-full px-4 py-2 border border-border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Event Date *</label>
              <input type="date" name="eventDate" required value={formData.eventDate} onChange={handleChange} className="w-full px-4 py-2 border border-border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Time *</label>
              <input type="time" name="eventTime" required value={formData.eventTime} onChange={handleChange} className="w-full px-4 py-2 border border-border rounded-md" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Specific Requirements *</label>
              <textarea name="requirements" required rows="4" placeholder="List the sweets you need and approximate quantities..." value={formData.requirements} onChange={handleChange} className="w-full px-4 py-2 border border-border rounded-md"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Estimated Budget (Optional, ₹)</label>
              <input type="number" name="estimatedBudget" min="0" value={formData.estimatedBudget} onChange={handleChange} className="w-full px-4 py-2 border border-border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fulfillment *</label>
              <select name="fulfillmentType" required value={formData.fulfillmentType} onChange={handleChange} className="w-full px-4 py-2 border border-border rounded-md">
                <option value="pickup">Self Pickup</option>
                <option value="delivery">Delivery Required</option>
              </select>
            </div>
          </div>
          
          <div className="bg-blue-50 text-blue-800 p-4 rounded-md text-sm">
            <strong>Note:</strong> Submitting this form does not confirm the order. Our manager will review your requirements and contact you at {user?.phone || 'your registered number'} to finalize the menu, pricing, and confirm the booking.
          </div>

          <button type="submit" disabled={loading} className={`w-full py-3 bg-primary text-white font-bold rounded-md shadow hover:bg-primary-dark ${loading ? 'opacity-70' : ''}`}>
            {loading ? 'Submitting Request...' : 'Submit Bulk Order Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BulkOrder;
