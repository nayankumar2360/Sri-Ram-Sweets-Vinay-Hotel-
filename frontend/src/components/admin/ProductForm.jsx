import React, { useState, useEffect } from 'react';
import { HiXMark, HiPhoto } from 'react-icons/hi2';

const ProductForm = ({ product, categories, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    unit: 'piece',
    isAvailable: true,
    isVegetarian: true,
    preorderEnabled: false,
    minQuantity: 1
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        category: product.category?._id || product.category || '',
        price: product.price || '',
        unit: product.unit || 'piece',
        isAvailable: product.isAvailable ?? true,
        isVegetarian: product.isVegetarian ?? true,
        preorderEnabled: product.preorderEnabled ?? false,
        minQuantity: product.minQuantity || 1
      });
      setImagePreview(product.image || '');
    } else if (categories && categories.length > 0) {
      setFormData(prev => ({ ...prev, category: categories[0]._id }));
    }
  }, [product, categories]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      if (imageFile) {
        data.append('image', imageFile);
      }
      
      await onSubmit(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const units = ['kg', 'piece', 'plate', 'glass', 'box', 'dozen', 'half_kg', '250g'];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-[#E8DDD4] flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-[#2C1810]">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="p-2 text-[#6B4F3A] hover:bg-gray-100 rounded-full transition-colors">
            <HiXMark className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-[#6B4F3A] mb-2">Product Image</label>
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 border-2 border-dashed border-[#E8DDD4] rounded-xl flex items-center justify-center bg-gray-50 overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <HiPhoto className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div>
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className="px-4 py-2 bg-white border border-[#E8DDD4] rounded-lg text-sm font-medium text-[#2C1810] hover:bg-gray-50 cursor-pointer inline-block"
                >
                  Choose Image
                </label>
                <p className="text-xs text-[#6B4F3A] mt-2">Recommended: 800x800px, max 2MB</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#6B4F3A] mb-1">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-[#E8DDD4] focus:ring-2 focus:ring-[#9B2335] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6B4F3A] mb-1">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-[#E8DDD4] focus:ring-2 focus:ring-[#9B2335] focus:border-transparent"
              >
                <option value="">Select Category</option>
                {categories?.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6B4F3A] mb-1">Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-2 rounded-lg border border-[#E8DDD4] focus:ring-2 focus:ring-[#9B2335] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6B4F3A] mb-1">Unit *</label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-[#E8DDD4] focus:ring-2 focus:ring-[#9B2335] focus:border-transparent"
              >
                {units.map(u => (
                  <option key={u} value={u}>{u.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#6B4F3A] mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 rounded-lg border border-[#E8DDD4] focus:ring-2 focus:ring-[#9B2335] focus:border-transparent"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center space-x-3 p-3 border border-[#E8DDD4] rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
                className="w-5 h-5 text-[#9B2335] rounded focus:ring-[#9B2335]"
              />
              <span className="text-sm font-medium text-[#2C1810]">Available for Ordering</span>
            </label>
            <label className="flex items-center space-x-3 p-3 border border-[#E8DDD4] rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                name="isVegetarian"
                checked={formData.isVegetarian}
                onChange={handleChange}
                className="w-5 h-5 text-[#15803D] rounded focus:ring-[#15803D]"
              />
              <span className="text-sm font-medium text-[#2C1810]">Pure Veg</span>
            </label>
            <label className="flex items-center space-x-3 p-3 border border-[#E8DDD4] rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                name="preorderEnabled"
                checked={formData.preorderEnabled}
                onChange={handleChange}
                className="w-5 h-5 text-[#D4A017] rounded focus:ring-[#D4A017]"
              />
              <span className="text-sm font-medium text-[#2C1810]">Enable Pre-order</span>
            </label>
            <div>
              <label className="block text-xs font-medium text-[#6B4F3A] mb-1">Minimum Quantity</label>
              <input
                type="number"
                name="minQuantity"
                value={formData.minQuantity}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-1.5 rounded-lg border border-[#E8DDD4] focus:ring-2 focus:ring-[#9B2335]"
              />
            </div>
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
              {loading ? 'Saving...' : (product ? 'Update Product' : 'Add Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
