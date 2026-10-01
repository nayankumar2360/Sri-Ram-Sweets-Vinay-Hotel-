import React, { useState, useEffect } from 'react';
import * as adminApi from '../../api/admin';
import Loading from '../../components/common/Loading';
import toast from 'react-hot-toast';
import { 
  HiBuildingStorefront, 
  HiCurrencyRupee, 
  HiTruck, 
  HiCalendarDays, 
  HiClock,
  HiPrinter,
  HiPlus,
  HiTrash
} from 'react-icons/hi2';
import { Link } from 'react-router-dom';

const AdminSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // New festival modal / state
  const [newFestival, setNewFestival] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    active: true
  });

  const fetchSettings = async () => {
    try {
      const res = await adminApi.getSettings();
      setSettings(res.data?.data || res.data || {});
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      await adminApi.updateSettings(settings);
      toast.success('Settings saved successfully');
      fetchSettings();
    } catch (error) {
      toast.error(error.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleFestival = (index) => {
    const updated = [...(settings.activeFestivals || [])];
    updated[index].active = !updated[index].active;
    handleChange('activeFestivals', updated);
  };

  const handleDeleteFestival = (index) => {
    const updated = (settings.activeFestivals || []).filter((_, i) => i !== index);
    handleChange('activeFestivals', updated);
  };

  const handleAddFestival = (e) => {
    e.preventDefault();
    if (!newFestival.name) {
      toast.error('Festival name is required');
      return;
    }
    const updated = [...(settings.activeFestivals || []), newFestival];
    handleChange('activeFestivals', updated);
    setNewFestival({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      active: true
    });
    toast.success('Festival added. Click Save Settings to persist.');
  };

  if (loading) return <div className="py-12"><Loading /></div>;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2C1810]">Restaurant Settings</h1>
          <p className="text-sm text-[#6B4F3A]">Manage shop information, UPI payment details, delivery rules, and festival campaigns</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Link
            to="/poster"
            target="_blank"
            className="inline-flex items-center bg-[#D4A017] text-white px-4 py-2 rounded-lg hover:bg-[#b58712] text-sm font-medium shadow-sm transition"
          >
            <HiPrinter className="mr-1.5 w-4 h-4" /> A4 QR Poster
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#9B2335] text-white px-5 py-2 rounded-lg hover:bg-[#7A1B29] text-sm font-medium shadow-sm transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Restaurant Identity */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E8DDD4] p-6 space-y-4">
          <div className="flex items-center space-x-2 text-[#9B2335] border-b border-[#E8DDD4] pb-3">
            <HiBuildingStorefront className="w-5 h-5" />
            <h2 className="font-bold text-lg text-[#2C1810]">Shop Identity</h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#6B4F3A] mb-1">Restaurant Name</label>
            <input
              type="text"
              value={settings.restaurantName || ''}
              onChange={(e) => handleChange('restaurantName', e.target.value)}
              className="w-full px-3 py-2 border border-[#E8DDD4] rounded-lg text-sm focus:ring-2 focus:ring-[#9B2335] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#6B4F3A] mb-1">Contact Phone</label>
              <input
                type="text"
                value={settings.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-[#E8DDD4] rounded-lg text-sm focus:ring-2 focus:ring-[#9B2335] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6B4F3A] mb-1">Email (Optional)</label>
              <input
                type="email"
                value={settings.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-[#E8DDD4] rounded-lg text-sm focus:ring-2 focus:ring-[#9B2335] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#6B4F3A] mb-1">Shop Address</label>
            <textarea
              rows={3}
              value={settings.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full px-3 py-2 border border-[#E8DDD4] rounded-lg text-sm focus:ring-2 focus:ring-[#9B2335] focus:outline-none"
              placeholder="e.g. Main Market, Near Clock Tower..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-[#6B4F3A] mb-1">Opening Time</label>
              <input
                type="time"
                value={settings.openingTime || '08:00'}
                onChange={(e) => handleChange('openingTime', e.target.value)}
                className="w-full px-3 py-2 border border-[#E8DDD4] rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6B4F3A] mb-1">Closing Time</label>
              <input
                type="time"
                value={settings.closingTime || '21:00'}
                onChange={(e) => handleChange('closingTime', e.target.value)}
                className="w-full px-3 py-2 border border-[#E8DDD4] rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        {/* UPI Payments & Direct Banking */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E8DDD4] p-6 space-y-4">
          <div className="flex items-center space-x-2 text-[#9B2335] border-b border-[#E8DDD4] pb-3">
            <HiCurrencyRupee className="w-5 h-5" />
            <h2 className="font-bold text-lg text-[#2C1810]">Direct UPI Payment Setup</h2>
          </div>

          <div className="bg-[#FFF9F0] p-3 rounded-lg border border-[#E8DDD4] text-xs text-[#6B4F3A]">
            Customers will scan this UPI QR or pay directly to this UPI ID upon order acceptance. Zero platform commission fees!
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#6B4F3A] mb-1">Shop UPI ID (VPA)</label>
            <input
              type="text"
              value={settings.upiId || ''}
              onChange={(e) => handleChange('upiId', e.target.value)}
              placeholder="e.g. shrirammisthan@upi"
              className="w-full px-3 py-2 border border-[#E8DDD4] rounded-lg text-sm font-mono focus:ring-2 focus:ring-[#9B2335] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#6B4F3A] mb-1">UPI Payee Display Name</label>
            <input
              type="text"
              value={settings.upiName || ''}
              onChange={(e) => handleChange('upiName', e.target.value)}
              placeholder="e.g. Sri Ram Sweets(Vinay Hotel)"
              className="w-full px-3 py-2 border border-[#E8DDD4] rounded-lg text-sm focus:ring-2 focus:ring-[#9B2335] focus:outline-none"
            />
          </div>

          {/* Delivery Configuration */}
          <div className="pt-4 border-t border-[#E8DDD4] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#2C1810] flex items-center">
                <HiTruck className="w-4 h-4 mr-1 text-[#9B2335]" /> Enable Home Delivery
              </span>
              <input
                type="checkbox"
                checked={settings.isDeliveryAvailable ?? true}
                onChange={(e) => handleChange('isDeliveryAvailable', e.target.checked)}
                className="w-4 h-4 accent-[#9B2335]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#6B4F3A] mb-1">Delivery Charge (₹)</label>
                <input
                  type="number"
                  value={settings.deliveryCharge ?? 30}
                  onChange={(e) => handleChange('deliveryCharge', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-[#E8DDD4] rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6B4F3A] mb-1">Free Delivery Above (₹)</label>
                <input
                  type="number"
                  value={settings.minOrderForFreeDelivery ?? 500}
                  onChange={(e) => handleChange('minOrderForFreeDelivery', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-[#E8DDD4] rounded-lg text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Festival Pre-Order Campaigns */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E8DDD4] p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-[#E8DDD4] pb-3">
          <div className="flex items-center space-x-2 text-[#9B2335]">
            <HiCalendarDays className="w-5 h-5" />
            <h2 className="font-bold text-lg text-[#2C1810]">Active Festival Campaigns</h2>
          </div>
          <span className="text-xs text-[#6B4F3A]">Customers can pre-order sweets for active festivals</span>
        </div>

        {/* Existing Festivals List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(settings.activeFestivals || []).map((fest, idx) => (
            <div 
              key={idx} 
              className={`p-4 rounded-xl border transition ${
                fest.active ? 'bg-[#FFF9F0] border-[#D4A017]' : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-[#2C1810] text-sm">{fest.name}</h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={fest.active}
                    onChange={() => handleToggleFestival(idx)}
                    className="accent-[#9B2335] w-4 h-4 cursor-pointer"
                    title="Toggle active"
                  />
                  <button
                    onClick={() => handleDeleteFestival(idx)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Delete"
                  >
                    <HiTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-[#6B4F3A] mt-1">{fest.description || 'Festive celebration'}</p>
              <div className="mt-3 text-[11px] font-medium text-[#9B2335]">
                {fest.active ? '● Pre-orders Open' : '○ Inactive'}
              </div>
            </div>
          ))}
        </div>

        {/* Add Festival Form */}
        <div className="bg-[#FAF5EE] rounded-xl p-4 border border-[#E8DDD4] space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#9B2335]">Add New Festival Campaign</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Festival Name (e.g. Raksha Bandhan)"
              value={newFestival.name}
              onChange={(e) => setNewFestival(prev => ({ ...prev, name: e.target.value }))}
              className="px-3 py-2 border border-[#E8DDD4] rounded-lg text-sm bg-white"
            />
            <input
              type="text"
              placeholder="Tagline / Description"
              value={newFestival.description}
              onChange={(e) => setNewFestival(prev => ({ ...prev, description: e.target.value }))}
              className="px-3 py-2 border border-[#E8DDD4] rounded-lg text-sm bg-white"
            />
            <button
              type="button"
              onClick={handleAddFestival}
              className="inline-flex items-center justify-center bg-[#9B2335] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#7A1B29] transition"
            >
              <HiPlus className="mr-1 w-4 h-4" /> Add Festival
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
