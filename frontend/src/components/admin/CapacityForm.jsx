import React, { useState, useEffect } from 'react';
import { HiXMark } from 'react-icons/hi2';

const CapacityForm = ({ capacity, products, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    product: '',
    date: new Date().toISOString().split('T')[0],
    maxCapacity: 100,
    unlimited: false
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (capacity) {
      setFormData({
        product: capacity.product?._id || capacity.product || '',
        date: new Date(capacity.date).toISOString().split('T')[0],
        maxCapacity: capacity.maxCapacity || 0,
        unlimited: capacity.maxCapacity === -1
      });
    } else if (products && products.length > 0) {
      setFormData(prev => ({ ...prev, product: products[0]._id }));
    }
  }, [capacity, products]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = {
        ...formData,
        maxCapacity: formData.unlimited ? -1 : Number(formData.maxCapacity)
      };
      await onSubmit(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-[#E8DDD4] flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#2C1810]">
            {capacity ? 'Edit Capacity' : 'Set Capacity'}
          </h2>
          <button onClick={onClose} className="p-2 text-[#6B4F3A] hover:bg-gray-100 rounded-full transition-colors">
            <HiXMark className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#6B4F3A] mb-1">Product *</label>
            <select
              name="product"
              value={formData.product}
              onChange={handleChange}
              required
              disabled={!!capacity} // Cannot change product when editing
              className="w-full px-4 py-2 rounded-lg border border-[#E8DDD4] focus:ring-2 focus:ring-[#9B2335] focus:border-transparent disabled:bg-gray-100"
            >
              <option value="">Select Pre-order Product</option>
              {products?.map(prod => (
                <option key={prod._id} value={prod._id}>{prod.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#6B4F3A] mb-1">Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              disabled={!!capacity}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 rounded-lg border border-[#E8DDD4] focus:ring-2 focus:ring-[#9B2335] focus:border-transparent disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="flex items-center space-x-3 mb-4">
              <input
                type="checkbox"
                name="unlimited"
                checked={formData.unlimited}
                onChange={handleChange}
                className="w-5 h-5 text-[#9B2335] rounded focus:ring-[#9B2335]"
              />
              <span className="text-sm font-medium text-[#2C1810]">Unlimited Capacity</span>
            </label>

            {!formData.unlimited && (
              <div>
                <label className="block text-sm font-medium text-[#6B4F3A] mb-1">Max Capacity (Quantity) *</label>
                <input
                  type="number"
                  name="maxCapacity"
                  value={formData.maxCapacity}
                  onChange={handleChange}
                  required={!formData.unlimited}
                  min="1"
                  className="w-full px-4 py-2 rounded-lg border border-[#E8DDD4] focus:ring-2 focus:ring-[#9B2335] focus:border-transparent"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-[#E8DDD4]">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 border border-[#E8DDD4] rounded-lg text-[#6B4F3A] font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#9B2335] text-white rounded-lg font-medium hover:bg-[#7A1B29] transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Capacity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CapacityForm;
