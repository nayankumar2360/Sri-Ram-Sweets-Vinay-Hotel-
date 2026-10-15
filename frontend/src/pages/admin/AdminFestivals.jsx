import React, { useState, useEffect } from 'react';
import * as adminApi from '../../api/admin';
import Loading from '../../components/common/Loading';
import toast from 'react-hot-toast';
import {
  HiCalendarDays,
  HiSparkles,
  HiPlus,
  HiPencil,
  HiTrash,
  HiEye,
  HiLockClosed,
  HiLockOpen,
  HiArrowPath,
  HiCheckCircle,
  HiClock,
  HiExclamationTriangle,
  HiPhoto,
  HiXMark
} from 'react-icons/hi2';

const AdminFestivals = () => {
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  // Filters
  const [yearFilter, setYearFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [previewFestival, setPreviewFestival] = useState(null);
  const [editingFestival, setEditingFestival] = useState(null);
  const [overrideFestival, setOverrideFestival] = useState(null);

  // Form State
  const initialFormState = {
    name: '',
    slug: '',
    year: new Date().getFullYear(),
    region: 'Bihar',
    description: '',
    startDate: '',
    endDate: '',
    importantDays: [],
    banner: {
      headline: '',
      subtitle: '',
      ctaText: 'Pre-Order Now',
      ctaLink: '/pre-order',
      desktopImage: '',
      mobileImage: '',
      overlayOpacity: 0.45,
      focalPoint: 'center',
      enabled: true
    },
    preorderSettings: {
      enabled: true,
      leadTimeDays: 5,
      customOpenDate: '',
      customCloseDeadline: '',
      maxTotalOrders: 0
    },
    manualOverride: {
      status: 'auto',
      reason: ''
    },
    isFeatured: false,
    isActive: true
  };

  const [formData, setFormData] = useState(initialFormState);
  const [desktopFile, setDesktopFile] = useState(null);
  const [mobileFile, setMobileFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Quick Override Form State
  const [overrideStatus, setOverrideStatus] = useState('auto');
  const [overrideReason, setOverrideReason] = useState('');
  const [overrideCapacity, setOverrideCapacity] = useState(0);

  const fetchFestivals = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAdminFestivals({
        year: yearFilter || undefined,
        status: statusFilter || undefined,
        search: searchQuery || undefined,
        active: 'all'
      });
      const list = res.data?.data || res.data || [];
      setFestivals(Array.isArray(list) ? list : []);
    } catch (error) {
      toast.error('Failed to load festivals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFestivals();
  }, [yearFilter, statusFilter, searchQuery]);

  const handleOpenCreateModal = () => {
    setEditingFestival(null);
    setFormData(initialFormState);
    setDesktopFile(null);
    setMobileFile(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (fest) => {
    setEditingFestival(fest);
    setFormData({
      name: fest.name || '',
      slug: fest.slug || '',
      year: fest.year || new Date().getFullYear(),
      region: fest.region || 'Bihar',
      description: fest.description || '',
      startDate: fest.startDate ? new Date(fest.startDate).toISOString().split('T')[0] : '',
      endDate: fest.endDate ? new Date(fest.endDate).toISOString().split('T')[0] : '',
      importantDays: fest.importantDays ? fest.importantDays.map(d => ({
        ...d,
        date: d.date ? new Date(d.date).toISOString().split('T')[0] : ''
      })) : [],
      banner: {
        headline: fest.banner?.headline || '',
        subtitle: fest.banner?.subtitle || '',
        ctaText: fest.banner?.ctaText || 'Pre-Order Now',
        ctaLink: fest.banner?.ctaLink || '/pre-order',
        desktopImage: fest.banner?.desktopImage || '',
        mobileImage: fest.banner?.mobileImage || '',
        overlayOpacity: fest.banner?.overlayOpacity ?? 0.45,
        focalPoint: fest.banner?.focalPoint || 'center',
        enabled: fest.banner?.enabled ?? true
      },
      preorderSettings: {
        enabled: fest.preorderSettings?.enabled ?? true,
        leadTimeDays: fest.preorderSettings?.leadTimeDays ?? 5,
        customOpenDate: fest.preorderSettings?.customOpenDate ? new Date(fest.preorderSettings.customOpenDate).toISOString().split('T')[0] : '',
        customCloseDeadline: fest.preorderSettings?.customCloseDeadline ? new Date(fest.preorderSettings.customCloseDeadline).toISOString().split('T')[0] : '',
        maxTotalOrders: fest.preorderSettings?.maxTotalOrders || 0
      },
      manualOverride: {
        status: fest.manualOverride?.status || 'auto',
        reason: fest.manualOverride?.reason || ''
      },
      isFeatured: !!fest.isFeatured,
      isActive: fest.isActive ?? true
    });
    setDesktopFile(null);
    setMobileFile(null);
    setIsModalOpen(true);
  };

  const handleOpenOverrideModal = (fest) => {
    setOverrideFestival(fest);
    setOverrideStatus(fest.manualOverride?.status || 'auto');
    setOverrideReason(fest.manualOverride?.reason || '');
    setOverrideCapacity(fest.preorderSettings?.maxTotalOrders || 0);
    setIsOverrideModalOpen(true);
  };

  const handleSaveOverride = async (e) => {
    e.preventDefault();
    if (!overrideFestival) return;

    try {
      await adminApi.updateAdminFestivalPreorders(overrideFestival._id, {
        status: overrideStatus,
        reason: overrideReason,
        maxTotalOrders: Number(overrideCapacity)
      });
      toast.success(`Pre-order controls updated for ${overrideFestival.name}`);
      setIsOverrideModalOpen(false);
      fetchFestivals();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update preorder settings');
    }
  };

  const handleDeleteFestival = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await adminApi.deleteAdminFestival(id);
      toast.success(`Festival "${name}" deleted`);
      fetchFestivals();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete festival');
    }
  };

  const handleRunSeed = async () => {
    if (!window.confirm('Run the Bihar & National Festival Calendar seed script for 2026-2027? (This is safe & idempotent; existing orders and custom edits will not be lost).')) {
      return;
    }
    setSeeding(true);
    try {
      const res = await adminApi.seedAdminFestivals();
      const stats = res.data?.stats;
      toast.success(`Calendar seeded! Created: ${stats?.createdCount || 0}, Updated: ${stats?.updatedCount || 0}`);
      fetchFestivals();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to seed festival calendar');
    } finally {
      setSeeding(false);
    }
  };

  const handleToggleFeatured = async (fest) => {
    try {
      await adminApi.updateAdminFestivalBanner(fest._id, {
        isFeatured: !fest.isFeatured
      });
      toast.success(fest.isFeatured ? 'Removed from featured hero' : `Set "${fest.name}" as featured Hero Banner`);
      fetchFestivals();
    } catch (error) {
      toast.error('Failed to update featured banner');
    }
  };

  // Important Days handling in Form
  const handleAddImportantDay = () => {
    setFormData(prev => ({
      ...prev,
      importantDays: [...prev.importantDays, { title: '', date: '', description: '' }]
    }));
  };

  const handleRemoveImportantDay = (index) => {
    setFormData(prev => ({
      ...prev,
      importantDays: prev.importantDays.filter((_, i) => i !== index)
    }));
  };

  const handleImportantDayChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.importantDays];
      updated[index][field] = value;
      return { ...prev, importantDays: updated };
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return toast.error('Festival name is required');
    if (!formData.startDate || !formData.endDate) return toast.error('Start and end dates are required');

    setSubmitting(true);
    try {
      const formPayload = new FormData();
      formPayload.append('name', formData.name);
      formPayload.append('slug', formData.slug || '');
      formPayload.append('year', formData.year);
      formPayload.append('region', formData.region);
      formPayload.append('description', formData.description);
      formPayload.append('startDate', formData.startDate);
      formPayload.append('endDate', formData.endDate);
      formPayload.append('isFeatured', formData.isFeatured);
      formPayload.append('isActive', formData.isActive);

      formPayload.append('importantDays', JSON.stringify(formData.importantDays));
      formPayload.append('banner', JSON.stringify(formData.banner));
      formPayload.append('preorderSettings', JSON.stringify(formData.preorderSettings));
      formPayload.append('manualOverride', JSON.stringify(formData.manualOverride));

      if (desktopFile) {
        formPayload.append('desktopImage', desktopFile);
      }
      if (mobileFile) {
        formPayload.append('mobileImage', mobileFile);
      }

      if (editingFestival) {
        await adminApi.updateAdminFestival(editingFestival._id, formPayload);
        toast.success(`Festival "${formData.name}" updated successfully`);
      } else {
        await adminApi.createAdminFestival(formPayload);
        toast.success(`Festival "${formData.name}" created successfully`);
      }

      setIsModalOpen(false);
      fetchFestivals();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save festival');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E8DDD4] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#2C1810]">Festival Calendar & Banners</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#D4A017] text-[#2C1810]">
              Bihar-First Engine
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#6B4F3A] mt-1">
            Manage festival calendar dates (2026-2027), dynamic hero banners, ritual days, and smart preorder controls
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleRunSeed}
            disabled={seeding}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#D4A017] text-[#855e09] bg-amber-50 hover:bg-amber-100 rounded-lg text-xs sm:text-sm font-semibold shadow-sm transition disabled:opacity-50"
          >
            <HiArrowPath className={`w-4 h-4 ${seeding ? 'animate-spin' : ''}`} />
            {seeding ? 'Syncing...' : 'Sync 2026-2027 Bihar Calendar'}
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#9B2335] text-white hover:bg-[#7A1B29] rounded-lg text-xs sm:text-sm font-semibold shadow-sm transition"
          >
            <HiPlus className="w-4 h-4" />
            Add Festival
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-[#E8DDD4] grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-semibold text-[#6B4F3A] mb-1">Search Festivals</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Chhath, Diwali, Holi..."
            className="w-full px-3 py-2 border border-[#E8DDD4] rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-[#9B2335] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#6B4F3A] mb-1">Filter by Year</label>
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="w-full px-3 py-2 border border-[#E8DDD4] rounded-lg text-xs sm:text-sm bg-white focus:ring-2 focus:ring-[#9B2335] focus:outline-none"
          >
            <option value="">All Years</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
            <option value="2028">2028</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#6B4F3A] mb-1">Filter by Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-[#E8DDD4] rounded-lg text-xs sm:text-sm bg-white focus:ring-2 focus:ring-[#9B2335] focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="open">Pre-Orders Currently Open</option>
            <option value="ongoing">Festival Ongoing</option>
            <option value="upcoming">Upcoming Festivals</option>
            <option value="completed">Completed Festivals</option>
          </select>
        </div>

        <div className="flex items-end">
          <div className="text-xs text-[#6B4F3A] bg-[#FFF9F0] p-2 rounded-lg border border-[#E8DDD4] w-full text-center">
            Total Festivals: <strong>{festivals.length}</strong>
          </div>
        </div>
      </div>

      {/* Festivals Grid */}
      {loading ? (
        <div className="py-16"><Loading /></div>
      ) : festivals.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E8DDD4] p-12 text-center text-[#6B4F3A]">
          <p className="text-base font-semibold text-[#2C1810] mb-2">No festivals found matching filters</p>
          <p className="text-xs mb-4">Click "Sync 2026-2027 Bihar Calendar" above to auto-populate the verified festivals!</p>
          <button
            onClick={handleRunSeed}
            className="px-4 py-2 bg-[#9B2335] text-white rounded-lg text-xs font-medium"
          >
            Run Seed Script
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {festivals.map((fest) => {
            const start = fest.startDate ? new Date(fest.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
            const end = fest.endDate ? new Date(fest.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
            const isFeatured = !!fest.isFeatured;
            const isOpen = fest.isPreOrderOpen;
            const isManualClosed = fest.manualOverride?.status === 'closed';

            return (
              <div
                key={fest._id}
                className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md ${
                  isFeatured 
                    ? 'border-[#D4A017] ring-2 ring-[#D4A017]/30' 
                    : 'border-[#E8DDD4]'
                }`}
              >
                {/* Banner Thumbnail Header if available */}
                <div className="relative h-28 bg-gradient-to-r from-[#7A1B29] to-[#E8742A] overflow-hidden">
                  {fest.banner?.desktopImage && (
                    <img
                      src={fest.banner.desktopImage}
                      alt={fest.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/40" />

                  {/* Top Badges */}
                  <div className="absolute top-2 left-2 right-2 flex justify-between items-center text-xs">
                    <span className="px-2 py-0.5 rounded font-bold bg-[#D4A017] text-[#2C1810] text-[10px] shadow">
                      {fest.region || 'Bihar'} · {fest.year}
                    </span>

                    {isFeatured && (
                      <span className="px-2 py-0.5 rounded font-bold bg-amber-400 text-amber-950 text-[10px] flex items-center gap-1 shadow">
                        <HiSparkles className="w-3 h-3" /> Featured Hero Banner
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-2 left-3 right-3 text-white">
                    <h3 className="font-bold font-serif text-base truncate">{fest.name}</h3>
                    <p className="text-[11px] text-white/90">
                      📅 {start} {end && end !== start ? `— ${end}` : ''}
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Status Badges Strip */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      {fest.isOngoing ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          ● Festival Ongoing
                        </span>
                      ) : fest.festivalStatus === 'completed' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700">
                          Completed
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                          Upcoming in {fest.daysUntilFestival}d
                        </span>
                      )}

                      {fest.preorderStatus === 'open' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Pre-Orders Open
                        </span>
                      ) : fest.preorderStatus === 'temporarily_closed' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                          Paused by Owner
                        </span>
                      ) : fest.preorderStatus === 'sold_out' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                          Sold Out
                        </span>
                      ) : fest.preorderStatus === 'deadline_passed' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-200 text-gray-800">
                          Deadline Passed
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          Opens in {fest.daysUntilPreOrder}d
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#6B4F3A] line-clamp-2 mb-2">
                      {fest.description || fest.banner?.subtitle || 'Traditional Bihar festival celebration.'}
                    </p>

                    {/* Preorder & Capacity Details */}
                    <div className="text-[11px] bg-[#FFF9F0] p-2.5 rounded-lg border border-[#E8DDD4] space-y-1">
                      <div className="flex justify-between">
                        <span className="text-[#6B4F3A]">Orders Placed / Limit:</span>
                        <strong className="text-[#2C1810]">
                          {fest.preorderSettings?.currentTotalOrders || 0} / {fest.preorderSettings?.maxTotalOrders > 0 ? fest.preorderSettings.maxTotalOrders : 'Unlimited'}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6B4F3A]">Lead Time Window:</span>
                        <span className="text-[#2C1810] font-medium">{fest.preorderSettings?.leadTimeDays || 5} days before</span>
                      </div>
                      {fest.manualOverride?.reason && (
                        <div className="text-[10px] text-rose-700 italic border-t border-[#E8DDD4] pt-1 mt-1">
                          Reason: {fest.manualOverride.reason}
                        </div>
                      )}
                    </div>

                    {/* Important Ritual Days */}
                    {fest.importantDays && fest.importantDays.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {fest.importantDays.map((d, idx) => (
                          <span key={idx} className="text-[9px] bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                            {d.title}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-[#E8DDD4] flex items-center justify-between gap-1 text-xs">
                    <button
                      onClick={() => handleToggleFeatured(fest)}
                      className={`p-1.5 rounded transition ${
                        isFeatured 
                          ? 'text-[#D4A017] hover:bg-amber-50 font-semibold' 
                          : 'text-[#6B4F3A] hover:bg-gray-100'
                      }`}
                      title={isFeatured ? 'Featured as Hero Banner' : 'Set as Featured Hero Banner'}
                    >
                      <HiSparkles className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleOpenOverrideModal(fest)}
                      className="px-2.5 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-[#2C1810] font-medium text-[11px] flex items-center gap-1"
                      title="Quick Pre-Order Control"
                    >
                      {isManualClosed ? <HiLockClosed className="w-3.5 h-3.5 text-rose-600" /> : <HiLockOpen className="w-3.5 h-3.5 text-emerald-600" />}
                      Controls
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(fest)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                      title="Edit Festival & Banner"
                    >
                      <HiPencil className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteFestival(fest._id, fest.name)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                      title="Delete Festival"
                    >
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QUICK PRE-ORDER OVERRIDE MODAL */}
      {isOverrideModalOpen && overrideFestival && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E8DDD4] space-y-4">
            <div className="flex justify-between items-center border-b border-[#E8DDD4] pb-3">
              <div>
                <h3 className="font-bold text-lg text-[#2C1810]">Pre-Order Controls</h3>
                <p className="text-xs text-[#6B4F3A]">{overrideFestival.name}</p>
              </div>
              <button onClick={() => setIsOverrideModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <HiXMark className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOverride} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#6B4F3A] mb-1">Pre-Order Status Override</label>
                <select
                  value={overrideStatus}
                  onChange={(e) => setOverrideStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E8DDD4] rounded-lg text-sm bg-white"
                >
                  <option value="auto">Auto (Calculate based on dates & lead time)</option>
                  <option value="open">Force Open (Reopen during eligible window)</option>
                  <option value="closed">Force Closed (Pause pre-orders immediately)</option>
                </select>
                <p className="text-[10px] text-[#6B4F3A] mt-1">
                  * Note: Reopening is only permitted if festival is active and closing deadline hasn't passed.
                </p>
              </div>

              {overrideStatus === 'closed' && (
                <div>
                  <label className="block text-xs font-semibold text-[#6B4F3A] mb-1">Reason for Closing (Shown to Customers)</label>
                  <input
                    type="text"
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    placeholder="E.g., Production capacity reached for this batch"
                    className="w-full px-3 py-2 border border-[#E8DDD4] rounded-lg text-sm"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#6B4F3A] mb-1">Maximum Order Limit (0 for Unlimited)</label>
                <input
                  type="number"
                  min="0"
                  value={overrideCapacity}
                  onChange={(e) => setOverrideCapacity(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-[#E8DDD4] rounded-lg text-sm"
                />
                <p className="text-[10px] text-[#6B4F3A] mt-1">
                  Currently placed orders: {overrideFestival.preorderSettings?.currentTotalOrders || 0}
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E8DDD4]">
                <button
                  type="button"
                  onClick={() => setIsOverrideModalOpen(false)}
                  className="px-4 py-2 border border-[#E8DDD4] rounded-lg text-xs font-medium text-[#6B4F3A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#9B2335] text-white rounded-lg text-xs font-semibold hover:bg-[#7A1B29]"
                >
                  Save Pre-Order Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULL CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-[#E8DDD4] space-y-6 my-8">
            <div className="flex justify-between items-center border-b border-[#E8DDD4] pb-3">
              <div>
                <h3 className="font-bold text-xl text-[#2C1810]">
                  {editingFestival ? `Edit Festival: ${editingFestival.name}` : 'Add New Festival Campaign'}
                </h3>
                <p className="text-xs text-[#6B4F3A]">Configure dates, regional rituals, hero banner, and preorder rules</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <HiXMark className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Basic Festival Info */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#9B2335] border-b border-[#E8DDD4] pb-1">
                  1. Festival Identity & Dates
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#6B4F3A] mb-1">Festival Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Chhath Puja 2026"
                      className="w-full px-3 py-2 border border-[#E8DDD4] rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#6B4F3A] mb-1">URL Slug</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="auto-generated if empty"
                      className="w-full px-3 py-2 border border-[#E8DDD4] rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#6B4F3A] mb-1">Year *</label>
                    <input
                      type="number"
                      required
                      value={formData.year}
                      onChange={(e) => setFormData(prev => ({ ...prev, year: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-[#E8DDD4] rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#6B4F3A] mb-1">Region *</label>
                    <select
                      value={formData.region}
                      onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                      className="w-full px-3 py-2 border border-[#E8DDD4] rounded-lg text-sm bg-white"
                    >
                      <option value="Bihar">Bihar</option>
                      <option value="Pan-India">Pan-India</option>
                      <option value="Eastern India">Eastern India</option>
                      <option value="National">National</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#6B4F3A] mb-1">Start Date *</label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-[#E8DDD4] rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#6B4F3A] mb-1">End Date *</label>
                    <input
                      type="date"
                      required
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-[#E8DDD4] rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#6B4F3A] mb-1">Description / Significance</label>
                  <textarea
                    rows="2"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Details about festival traditions and authentic offerings..."
                    className="w-full px-3 py-2 border border-[#E8DDD4] rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Ritual & Important Days */}
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-[#E8DDD4] pb-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#9B2335]">
                    2. Important Rituals / Celebration Days
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddImportantDay}
                    className="text-xs text-[#9B2335] font-semibold hover:underline flex items-center gap-1"
                  >
                    <HiPlus className="w-3.5 h-3.5" /> Add Ritual Day
                  </button>
                </div>

                {formData.importantDays.length === 0 ? (
                  <p className="text-xs text-[#6B4F3A] italic">No specific ritual days added (optional).</p>
                ) : (
                  formData.importantDays.map((day, idx) => (
                    <div key={idx} className="flex gap-2 items-center bg-[#FFF9F0] p-2 rounded-lg border border-[#E8DDD4]">
                      <input
                        type="text"
                        placeholder="Day Title (e.g. Nahay Khay)"
                        value={day.title}
                        onChange={(e) => handleImportantDayChange(idx, 'title', e.target.value)}
                        className="flex-1 px-2.5 py-1.5 border border-[#E8DDD4] rounded text-xs bg-white"
                        required
                      />
                      <input
                        type="date"
                        value={day.date}
                        onChange={(e) => handleImportantDayChange(idx, 'date', e.target.value)}
                        className="px-2.5 py-1.5 border border-[#E8DDD4] rounded text-xs bg-white"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Description (Optional)"
                        value={day.description || ''}
                        onChange={(e) => handleImportantDayChange(idx, 'description', e.target.value)}
                        className="flex-1 px-2.5 py-1.5 border border-[#E8DDD4] rounded text-xs bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImportantDay(idx)}
                        className="p-1 text-rose-600 hover:text-rose-800"
                      >
                        <HiTrash className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Hero Banner Settings */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#9B2335] border-b border-[#E8DDD4] pb-1">
                  3. Dynamic Hero Banner Customization
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#6B4F3A] mb-1">Banner Headline</label>
                    <input
                      type="text"
                      value={formData.banner.headline}
                      onChange={(e) => setFormData(prev => ({ ...prev, banner: { ...prev.banner, headline: e.target.value } }))}
                      placeholder="e.g. Celebrate Chhath with Devotion and Tradition"
                      className="w-full px-3 py-2 border border-[#E8DDD4] rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#6B4F3A] mb-1">CTA Button Text</label>
                    <input
                      type="text"
                      value={formData.banner.ctaText}
                      onChange={(e) => setFormData(prev => ({ ...prev, banner: { ...prev.banner, ctaText: e.target.value } }))}
                      placeholder="e.g. Explore Chhath Specials"
                      className="w-full px-3 py-2 border border-[#E8DDD4] rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#6B4F3A] mb-1">Banner Subtitle / Promotional Message</label>
                  <input
                    type="text"
                    value={formData.banner.subtitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, banner: { ...prev.banner, subtitle: e.target.value } }))}
                    placeholder="e.g. Bring home traditional thekua, prasad and festive offerings..."
                    className="w-full px-3 py-2 border border-[#E8DDD4] rounded-lg text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#6B4F3A] mb-1">Desktop Image (URL or Upload)</label>
                    <input
                      type="text"
                      value={formData.banner.desktopImage}
                      onChange={(e) => setFormData(prev => ({ ...prev, banner: { ...prev.banner, desktopImage: e.target.value } }))}
                      placeholder="https://images.unsplash.com/... or upload below"
                      className="w-full px-3 py-2 border border-[#E8DDD4] rounded-lg text-xs mb-1.5"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setDesktopFile(e.target.files[0])}
                      className="text-xs text-[#6B4F3A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#6B4F3A] mb-1">Mobile Image (URL or Upload)</label>
                    <input
                      type="text"
                      value={formData.banner.mobileImage}
                      onChange={(e) => setFormData(prev => ({ ...prev, banner: { ...prev.banner, mobileImage: e.target.value } }))}
                      placeholder="Optional mobile image"
                      className="w-full px-3 py-2 border border-[#E8DDD4] rounded-lg text-xs mb-1.5"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setMobileFile(e.target.files[0])}
                      className="text-xs text-[#6B4F3A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#6B4F3A] mb-1">Overlay Opacity ({formData.banner.overlayOpacity})</label>
                    <input
                      type="range"
                      min="0.1"
                      max="0.9"
                      step="0.05"
                      value={formData.banner.overlayOpacity}
                      onChange={(e) => setFormData(prev => ({ ...prev, banner: { ...prev.banner, overlayOpacity: Number(e.target.value) } }))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#6B4F3A] mb-1">Image Focal Point</label>
                    <select
                      value={formData.banner.focalPoint}
                      onChange={(e) => setFormData(prev => ({ ...prev, banner: { ...prev.banner, focalPoint: e.target.value } }))}
                      className="w-full px-3 py-2 border border-[#E8DDD4] rounded-lg text-xs bg-white"
                    >
                      <option value="center">Center</option>
                      <option value="top">Top</option>
                      <option value="bottom">Bottom</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-4 pt-4">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#6B4F3A]">
                      <input
                        type="checkbox"
                        checked={formData.banner.enabled}
                        onChange={(e) => setFormData(prev => ({ ...prev, banner: { ...prev.banner, enabled: e.target.checked } }))}
                        className="accent-[#9B2335] w-4 h-4"
                      />
                      Banner Enabled
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#6B4F3A]">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                        className="accent-[#D4A017] w-4 h-4"
                      />
                      Featured Banner
                    </label>
                  </div>
                </div>
              </div>

              {/* Pre-Order Rules */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#9B2335] border-b border-[#E8DDD4] pb-1">
                  4. Pre-Order Automation & Capacity Limits
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#6B4F3A] mb-1">Lead Time (Days Prior) *</label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      required
                      value={formData.preorderSettings.leadTimeDays}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        preorderSettings: { ...prev.preorderSettings, leadTimeDays: Number(e.target.value) }
                      }))}
                      className="w-full px-3 py-2 border border-[#E8DDD4] rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#6B4F3A] mb-1">Max Order Capacity (0 = Unlimited)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.preorderSettings.maxTotalOrders}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        preorderSettings: { ...prev.preorderSettings, maxTotalOrders: Number(e.target.value) }
                      }))}
                      className="w-full px-3 py-2 border border-[#E8DDD4] rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#6B4F3A] mb-1">Manual Override State</label>
                    <select
                      value={formData.manualOverride.status}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        manualOverride: { ...prev.manualOverride, status: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-[#E8DDD4] rounded-lg text-sm bg-white"
                    >
                      <option value="auto">Auto (Date-based calculation)</option>
                      <option value="open">Force Open</option>
                      <option value="closed">Force Closed (Paused)</option>
                    </select>
                  </div>
                </div>

                {formData.manualOverride.status === 'closed' && (
                  <div>
                    <label className="block text-xs font-semibold text-[#6B4F3A] mb-1">Reason for Closing</label>
                    <input
                      type="text"
                      value={formData.manualOverride.reason}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        manualOverride: { ...prev.manualOverride, reason: e.target.value }
                      }))}
                      placeholder="e.g. Sold out for festival day"
                      className="w-full px-3 py-2 border border-[#E8DDD4] rounded-lg text-sm"
                    />
                  </div>
                )}
              </div>

              {/* Form Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#E8DDD4]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-[#E8DDD4] rounded-lg text-sm font-medium text-[#6B4F3A] hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-[#9B2335] text-white rounded-lg text-sm font-bold hover:bg-[#7A1B29] shadow-sm disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingFestival ? 'Save Changes' : 'Create Festival'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFestivals;
