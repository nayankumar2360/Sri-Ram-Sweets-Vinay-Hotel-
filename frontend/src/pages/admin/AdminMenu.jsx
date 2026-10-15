import React, { useState, useEffect } from 'react';
import * as adminApi from '../../api/admin';
import ProductForm from '../../components/admin/ProductForm';
import Loading from '../../components/common/Loading';
import { formatPrice } from '../../utils/formatters';
import toast from 'react-hot-toast';
import { HiPlus, HiPencilSquare, HiTrash, HiXMark } from 'react-icons/hi2';

const CategoryForm = ({ category, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    order: 0,
    active: true
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        order: category.order ?? 0,
        active: category.active ?? true
      });
    } else {
      setFormData({
        name: '',
        description: '',
        order: 0,
        active: true
      });
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }
    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-[#E8DDD4] flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-[#2C1810]">
            {category ? 'Edit Category' : 'Add New Category'}
          </h2>
          <button 
            type="button"
            onClick={onClose} 
            className="p-2 text-[#6B4F3A] hover:bg-gray-100 rounded-full transition-colors"
          >
            <HiXMark className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#6B4F3A] mb-1">
              Category Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Sweets, Snacks, Beverages"
              className="w-full px-4 py-2 border border-[#E8DDD4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B2335] text-[#2C1810]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#6B4F3A] mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of this category..."
              className="w-full px-4 py-2 border border-[#E8DDD4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B2335] text-[#2C1810]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#6B4F3A] mb-1">
              Order / Sort Position
            </label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#E8DDD4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B2335] text-[#2C1810]"
            />
            <p className="text-xs text-[#6B4F3A] mt-1">Lower numbers appear first in menus.</p>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="categoryActive"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className="w-4 h-4 text-[#9B2335] border-[#E8DDD4] rounded focus:ring-[#9B2335]"
            />
            <label htmlFor="categoryActive" className="text-sm font-medium text-[#2C1810] cursor-pointer">
              Active (visible to customers)
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-[#E8DDD4]">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-[#E8DDD4] text-[#6B4F3A] rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#9B2335] text-white rounded-lg hover:bg-[#7A1B29] transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : (category ? 'Update Category' : 'Create Category')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminMenu = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        adminApi.getProducts(),
        adminApi.getCategories()
      ]);
      const prods = prodRes.data?.products || prodRes.data?.data || prodRes.data || [];
      const cats = catRes.data?.categories || catRes.data?.data || catRes.data || [];
      setProducts(Array.isArray(prods) ? prods : []);
      setCategories(Array.isArray(cats) ? cats : []);
    } catch (error) {
      toast.error('Failed to load menu data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleProductSubmit = async (formData) => {
    try {
      if (editingProduct) {
        await adminApi.updateProduct(editingProduct._id, formData);
        toast.success('Product updated');
      } else {
        await adminApi.createProduct(formData);
        toast.success('Product added');
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
      fetchData();
    } catch (error) {
      toast.error(error.message || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await adminApi.deleteProduct(id);
        toast.success('Product deleted');
        fetchData();
      } catch (error) {
        toast.error(error.message || 'Failed to delete product');
      }
    }
  };

  const handleToggleAvailability = async (id, isAvailable) => {
    try {
      await adminApi.toggleAvailability(id, isAvailable);
      toast.success(isAvailable ? 'Product marked available' : 'Product marked unavailable');
      setProducts(products.map(p => p._id === id ? { ...p, isAvailable, available: isAvailable } : p));
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleCategorySubmit = async (categoryData) => {
    try {
      if (editingCategory) {
        await adminApi.updateCategory(editingCategory._id, categoryData);
        toast.success('Category updated');
      } else {
        await adminApi.createCategory(categoryData);
        toast.success('Category added');
      }
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to save category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await adminApi.deleteCategory(id);
        toast.success('Category deleted');
        fetchData();
      } catch (error) {
        toast.error(error.response?.data?.message || error.message || 'Failed to delete category');
      }
    }
  };

  const handleToggleCategoryActive = async (id, active) => {
    try {
      await adminApi.updateCategory(id, { active });
      toast.success(active ? 'Category activated' : 'Category deactivated');
      setCategories(categories.map(c => c._id === id ? { ...c, active } : c));
    } catch (error) {
      toast.error('Failed to update category status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-[#2C1810]">Menu Management</h1>
        {activeTab === 'products' ? (
          <button 
            onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); }}
            className="flex items-center space-x-2 bg-[#9B2335] text-white px-4 py-2 rounded-lg hover:bg-[#7A1B29] transition-colors"
          >
            <HiPlus className="w-5 h-5" />
            <span>Add Product</span>
          </button>
        ) : (
          <button 
            onClick={() => { setEditingCategory(null); setIsCategoryModalOpen(true); }}
            className="flex items-center space-x-2 bg-[#9B2335] text-white px-4 py-2 rounded-lg hover:bg-[#7A1B29] transition-colors"
          >
            <HiPlus className="w-5 h-5" />
            <span>Add Category</span>
          </button>
        )}
      </div>

      <div className="flex space-x-1 bg-white p-1 rounded-lg border border-[#E8DDD4] w-max">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'products' ? 'bg-[#9B2335] text-white' : 'text-[#6B4F3A] hover:bg-gray-50'}`}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'categories' ? 'bg-[#9B2335] text-white' : 'text-[#6B4F3A] hover:bg-gray-50'}`}
        >
          Categories
        </button>
      </div>

      {loading ? (
        <div className="py-12"><Loading /></div>
      ) : activeTab === 'products' ? (
        <div className="bg-white rounded-xl shadow-sm border border-[#E8DDD4] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FFF9F0] border-b border-[#E8DDD4] text-sm text-[#6B4F3A]">
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold text-center">Available</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DDD4]">
              {products.map(product => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="p-4 flex items-center space-x-3">
                    <img src={product.image || 'https://via.placeholder.com/40'} alt={product.name} className="w-10 h-10 rounded object-cover border" />
                    <div>
                      <p className="font-medium text-[#2C1810]">{product.name}</p>
                      <p className="text-xs text-[#6B4F3A]">{product.unit}</p>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-[#6B4F3A]">{product.category?.name}</td>
                  <td className="p-4 text-sm font-medium text-[#2C1810]">{formatPrice(product.price)}</td>
                  <td className="p-4 text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={product.isAvailable ?? product.available ?? true}
                        onChange={(e) => handleToggleAvailability(product._id, e.target.checked)}
                      />
                      <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#15803D]"></div>
                    </label>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => { setEditingProduct(product); setIsProductModalOpen(true); }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit Product"
                    >
                      <HiPencilSquare className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors ml-1"
                      title="Delete Product"
                    >
                      <HiTrash className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-[#6B4F3A]">
                    No products found. Click &quot;Add Product&quot; to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-[#E8DDD4] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FFF9F0] border-b border-[#E8DDD4] text-sm text-[#6B4F3A]">
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Description</th>
                <th className="p-4 font-semibold text-center">Order</th>
                <th className="p-4 font-semibold text-center">Active</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DDD4]">
              {categories.map(category => (
                <tr key={category._id} className="hover:bg-gray-50 text-sm">
                  <td className="p-4 font-medium text-[#2C1810]">
                    {category.name}
                  </td>
                  <td className="p-4 text-[#6B4F3A] max-w-xs truncate">
                    {category.description || <span className="text-gray-400 italic">No description</span>}
                  </td>
                  <td className="p-4 text-center font-medium text-[#2C1810]">
                    {category.order ?? 0}
                  </td>
                  <td className="p-4 text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={category.active ?? true}
                        onChange={(e) => handleToggleCategoryActive(category._id, e.target.checked)}
                      />
                      <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#15803D]"></div>
                    </label>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => { setEditingCategory(category); setIsCategoryModalOpen(true); }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit Category"
                    >
                      <HiPencilSquare className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteCategory(category._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors ml-1"
                      title="Delete Category"
                    >
                      <HiTrash className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-[#6B4F3A]">
                    No categories found. Click &quot;Add Category&quot; to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isProductModalOpen && (
        <ProductForm 
          product={editingProduct} 
          categories={categories}
          onSubmit={handleProductSubmit}
          onClose={() => { setIsProductModalOpen(false); setEditingProduct(null); }}
        />
      )}

      {isCategoryModalOpen && (
        <CategoryForm 
          category={editingCategory} 
          onSubmit={handleCategorySubmit}
          onClose={() => { setIsCategoryModalOpen(false); setEditingCategory(null); }}
        />
      )}
    </div>
  );
};

export default AdminMenu;
