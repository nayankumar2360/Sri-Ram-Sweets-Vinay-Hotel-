import React, { useState, useEffect } from 'react';
import * as adminApi from '../../api/admin';
import ProductForm from '../../components/admin/ProductForm';
import Loading from '../../components/common/Loading';
import { formatPrice } from '../../utils/formatters';
import toast from 'react-hot-toast';
import { HiPlus, HiPencilSquare, HiTrash } from 'react-icons/hi2';

const AdminMenu = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

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
      await adminApi.updateProduct(id, { isAvailable });
      toast.success(isAvailable ? 'Product marked available' : 'Product marked unavailable');
      setProducts(products.map(p => p._id === id ? { ...p, isAvailable } : p));
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-[#2C1810]">Menu Management</h1>
        {activeTab === 'products' && (
          <button 
            onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); }}
            className="flex items-center space-x-2 bg-[#9B2335] text-white px-4 py-2 rounded-lg hover:bg-[#7A1B29] transition-colors"
          >
            <HiPlus className="w-5 h-5" />
            <span>Add Product</span>
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
                        checked={product.isAvailable}
                        onChange={(e) => handleToggleAvailability(product._id, e.target.checked)}
                      />
                      <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#15803D]"></div>
                    </label>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => { setEditingProduct(product); setIsProductModalOpen(true); }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      <HiPencilSquare className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors ml-1"
                    >
                      <HiTrash className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-[#E8DDD4] p-6">
          <p className="text-[#6B4F3A]">Categories management interface goes here (simplified for MVP).</p>
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
    </div>
  );
};

export default AdminMenu;
