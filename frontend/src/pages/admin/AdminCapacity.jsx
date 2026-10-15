import React, { useState, useEffect } from 'react';
import * as adminApi from '../../api/admin';
import CapacityForm from '../../components/admin/CapacityForm';
import Loading from '../../components/common/Loading';
import toast from 'react-hot-toast';
import { HiPencilSquare, HiTrash } from 'react-icons/hi2';

const AdminCapacity = () => {
  const [capacities, setCapacities] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCapacity, setEditingCapacity] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [capRes, prodRes] = await Promise.all([
        adminApi.getCapacities(),
        adminApi.getProducts({ preorderEnabled: true })
      ]);
      const caps = capRes.data?.data || capRes.data || [];
      const prods = prodRes.data?.products || prodRes.data?.data || prodRes.data || [];
      setCapacities(Array.isArray(caps) ? caps : []);
      setProducts(Array.isArray(prods) ? prods : []);
    } catch (error) {
      toast.error('Failed to load capacity data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveCapacity = async (data) => {
    try {
      if (editingCapacity) {
        await adminApi.updateCapacity(editingCapacity._id, data);
        toast.success('Capacity updated successfully');
      } else {
        await adminApi.setCapacity(data);
        toast.success('Capacity saved successfully');
      }
      setIsModalOpen(false);
      setEditingCapacity(null);
      fetchData();
    } catch (error) {
      toast.error(error.message || 'Failed to save capacity');
    }
  };

  const handleEdit = (cap) => {
    setEditingCapacity(cap);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this capacity constraint?')) {
      try {
        await adminApi.deleteCapacity(id);
        toast.success('Capacity deleted successfully');
        fetchData();
      } catch (error) {
        toast.error(error.message || 'Failed to delete capacity');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#2C1810]">Capacity Management</h1>
        <button 
          onClick={() => {
            setEditingCapacity(null);
            setIsModalOpen(true);
          }}
          className="bg-[#9B2335] text-white px-4 py-2 rounded-lg hover:bg-[#7A1B29]"
        >
          Set Capacity
        </button>
      </div>

      {loading ? <Loading /> : (
        <div className="bg-white rounded-xl shadow-sm border border-[#E8DDD4] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FFF9F0] border-b border-[#E8DDD4] text-sm text-[#6B4F3A]">
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Max Capacity</th>
                <th className="p-4 font-semibold">Ordered</th>
                <th className="p-4 font-semibold">Remaining</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DDD4]">
              {capacities.map(cap => {
                const remaining = cap.maxCapacity === -1 ? 'Unlimited' : cap.maxCapacity - cap.currentOrdered;
                return (
                  <tr key={cap._id} className="hover:bg-gray-50 text-sm">
                    <td className="p-4 font-medium text-[#2C1810]">{cap.product?.name}</td>
                    <td className="p-4 text-[#6B4F3A]">{new Date(cap.date).toLocaleDateString()}</td>
                    <td className="p-4">{cap.maxCapacity === -1 ? 'Unlimited' : cap.maxCapacity}</td>
                    <td className="p-4 text-[#9B2335] font-medium">{cap.currentOrdered}</td>
                    <td className="p-4">
                      {remaining === 0 ? (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded">FULL</span>
                      ) : (
                        <span className="font-medium text-[#15803D]">{remaining}</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(cap)}
                          className="p-1 text-[#6B4F3A] hover:text-[#9B2335] hover:bg-gray-100 rounded transition-colors"
                          title="Edit"
                        >
                          <HiPencilSquare className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(cap._id)}
                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <HiTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {capacities.length === 0 && (
                <tr><td colSpan="6" className="p-8 text-center text-[#6B4F3A]">No capacity constraints set</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <CapacityForm 
          capacity={editingCapacity}
          products={products}
          onSubmit={handleSaveCapacity}
          onClose={() => {
            setIsModalOpen(false);
            setEditingCapacity(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminCapacity;
