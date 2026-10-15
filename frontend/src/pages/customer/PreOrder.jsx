import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getFestivals as getFestivalsFromApi } from '../../api/festivals';
import { getFestivals as getLegacyFestivals, checkCapacity, createPreOrder } from '../../api/preOrders';
import { getProducts } from '../../api/products';
import { useAuth } from '../../hooks/useAuth';
import Loading from '../../components/common/Loading';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/formatters';
import { 
  HiCalendarDays, 
  HiSparkles, 
  HiClock, 
  HiCheckCircle, 
  HiLockClosed, 
  HiExclamationTriangle,
  HiMapPin
} from 'react-icons/hi2';

// Countdown timer component
const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const calcTime = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const diff = target - now;

      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calcTime());
    const timer = setInterval(() => setTimeLeft(calcTime()), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <div className="flex justify-center gap-2.5">
      {units.map((u) => (
        <div key={u.label} className="flex flex-col items-center">
          <div className="bg-[#9B2335] text-white text-base sm:text-lg font-bold w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center shadow-sm">
            {String(u.value || 0).padStart(2, '0')}
          </div>
          <span className="text-[10px] text-[#6B4F3A] mt-1 font-medium">{u.label}</span>
        </div>
      ))}
    </div>
  );
};

// Upgraded Festival Card component
const FestivalCard = ({ festival, isSelected, onSelect }) => {
  const startDate = festival.startDate ? new Date(festival.startDate) : null;
  const endDate = festival.endDate ? new Date(festival.endDate) : startDate;
  const isOpen = festival.isPreOrderOpen !== false && festival.preorderStatus !== 'temporarily_closed' && festival.preorderStatus !== 'sold_out' && festival.preorderStatus !== 'deadline_passed';

  const formatFestDate = (d) =>
    d ? d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

  return (
    <div
      onClick={() => isOpen && onSelect(festival._id)}
      className={`relative rounded-xl border-2 p-5 transition-all duration-200 flex flex-col justify-between ${
        !isOpen
          ? 'border-[#E8DDD4] bg-gray-50/90 cursor-not-allowed opacity-85'
          : isSelected
          ? 'border-[#9B2335] bg-red-50/70 shadow-md ring-2 ring-[#9B2335]/20 cursor-pointer'
          : 'border-[#E8DDD4] bg-white hover:border-[#9B2335]/50 hover:shadow-md cursor-pointer'
      }`}
    >
      {isSelected && isOpen && (
        <div className="absolute -top-2.5 -right-2.5 bg-[#9B2335] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md">
          ✓
        </div>
      )}

      <div>
        <div className="flex items-start justify-between mb-2.5 gap-2">
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-lg font-bold text-[#9B2335] font-serif">{festival.name}</h3>
              {festival.region && (
                <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-[#D4A017]/15 text-[#855e09]">
                  {festival.region}
                </span>
              )}
            </div>
            {startDate && (
              <p className="text-xs text-[#6B4F3A] mt-1 flex items-center gap-1">
                <HiCalendarDays className="w-3.5 h-3.5 text-[#9B2335]" />
                {formatFestDate(startDate)}
                {endDate && endDate.getTime() !== startDate.getTime() && ` — ${formatFestDate(endDate)}`}
              </p>
            )}
          </div>

          <div>
            {festival.isOngoing ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Ongoing
              </span>
            ) : isOpen ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <HiCheckCircle className="w-3 h-3 text-emerald-600" />
                Pre-Orders Open
              </span>
            ) : festival.preorderStatus === 'temporarily_closed' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
                <HiLockClosed className="w-3 h-3" />
                Paused
              </span>
            ) : festival.preorderStatus === 'sold_out' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
                <HiExclamationTriangle className="w-3 h-3" />
                Sold Out
              </span>
            ) : festival.preorderStatus === 'deadline_passed' ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-700">
                Closed
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                <HiClock className="w-3 h-3 text-amber-600" />
                Opens in {festival.daysUntilPreOrder ?? festival.preOrderStartDays}d
              </span>
            )}
          </div>
        </div>

        {festival.description && (
          <p className="text-xs text-[#6B4F3A] mb-3 line-clamp-2 leading-relaxed">{festival.description}</p>
        )}

        {/* Important Ritual Days Tags if present */}
        {festival.importantDays && festival.importantDays.length > 0 && (
          <div className="mb-3 pt-2 border-t border-[#E8DDD4]/50 flex flex-wrap gap-1.5">
            {festival.importantDays.slice(0, 4).map((d, i) => (
              <span key={i} className="text-[10px] bg-white px-2 py-0.5 rounded border border-[#E8DDD4] text-[#6B4F3A] font-medium">
                {d.title}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Status banner / countdown */}
      {isOpen ? (
        startDate && festival.daysUntilFestival > 0 && (
          <div className="mt-2 pt-3 border-t border-[#E8DDD4]/60">
            <p className="text-[11px] text-[#6B4F3A] text-center mb-1.5 font-medium">Festival commences in</p>
            <CountdownTimer targetDate={festival.startDate} />
          </div>
        )
      ) : festival.preorderStatus === 'temporarily_closed' ? (
        <div className="mt-2 pt-2 border-t border-dashed border-[#E8DDD4] text-center text-xs text-rose-800 bg-rose-50 p-2 rounded-lg font-medium">
          🔒 {festival.statusReason || 'Pre-orders temporarily paused by owner.'}
        </div>
      ) : festival.preorderStatus === 'sold_out' ? (
        <div className="mt-2 pt-2 border-t border-dashed border-[#E8DDD4] text-center text-xs text-rose-800 bg-rose-50 p-2 rounded-lg font-medium">
          ⚠️ Pre-order capacity reached for this festival.
        </div>
      ) : festival.preorderStatus === 'deadline_passed' ? (
        <div className="mt-2 pt-2 border-t border-dashed border-[#E8DDD4] text-center text-xs text-gray-700 bg-gray-100 p-2 rounded-lg font-medium">
          ⌛ The pre-order deadline has passed.
        </div>
      ) : (
        <div className="mt-2 pt-2 border-t border-dashed border-[#E8DDD4] text-center text-xs text-amber-800 bg-amber-50 p-2 rounded-lg">
          ⏳ Pre-orders open on <strong>{formatFestDate(new Date(festival.preOrderOpensOn))}</strong>
        </div>
      )}
    </div>
  );
};

// Product selector card
const ProductCard = ({ product, qty, onQuantityChange }) => {
  return (
    <div className={`rounded-xl border-2 p-4 transition-all duration-200 flex flex-col justify-between ${
      qty > 0 ? 'border-[#9B2335] bg-red-50/50 shadow-sm' : 'border-[#E8DDD4] bg-white'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0 pr-2">
          <h4 className="font-semibold text-[#2C1810] text-sm truncate">{product.name}</h4>
          <p className="text-sm text-[#9B2335] font-semibold mt-0.5">
            {formatPrice(product.price)}
            <span className="text-[#6B4F3A] font-normal text-xs"> / {product.unit}</span>
          </p>
        </div>
        <div className="flex items-center gap-1">
          {qty > 0 && (
            <button
              type="button"
              onClick={() => onQuantityChange(product._id, -1)}
              className="w-8 h-8 rounded-lg bg-white border border-[#E8DDD4] text-[#9B2335] font-bold hover:bg-red-50 transition-colors flex items-center justify-center text-lg"
            >
              −
            </button>
          )}
          {qty > 0 && (
            <span className="w-8 text-center font-bold text-base text-[#9B2335]">{qty}</span>
          )}
          <button
            type="button"
            onClick={() => onQuantityChange(product._id, 1)}
            className={`w-8 h-8 rounded-lg font-bold transition-colors flex items-center justify-center text-lg ${
              qty > 0
                ? 'bg-white border border-[#E8DDD4] text-[#9B2335] hover:bg-red-50'
                : 'bg-[#9B2335] text-white hover:bg-[#7A1B29] shadow-sm'
            }`}
          >
            +
          </button>
        </div>
      </div>
      {qty > 0 && (
        <div className="mt-2 pt-2 border-t border-[#9B2335]/10 text-xs text-right font-medium text-[#9B2335]">
          Subtotal: {formatPrice(product.price * qty)}
        </div>
      )}
    </div>
  );
};

const PreOrder = () => {
  const [festivals, setFestivals] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [selectedFestival, setSelectedFestival] = useState('');
  const [selectedProducts, setSelectedProducts] = useState({});
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [fulfillmentType, setFulfillmentType] = useState('pickup');
  const [notes, setNotes] = useState('');

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlFestivalParam = searchParams.get('festival');

  useEffect(() => {
    const fetchData = async () => {
      try {
        let festList = [];
        try {
          const festRes = await getFestivalsFromApi();
          festList = festRes.data?.data || festRes.data || [];
        } catch (e) {
          const fallbackRes = await getLegacyFestivals();
          festList = fallbackRes.data?.data || fallbackRes.data || [];
        }

        const safeFests = Array.isArray(festList) ? festList : [];
        setFestivals(safeFests);

        const prodRes = await getProducts({ preorderEnabled: true });
        const rawProds = prodRes.data?.products || prodRes.data?.data || prodRes.data || [];
        const prods = Array.isArray(rawProds) ? rawProds : [];
        setProducts(prods.filter((p) => p.preorderEnabled));

        if (safeFests.length > 0) {
          // If URL param specified festival slug or name, match it
          let matched = null;
          if (urlFestivalParam) {
            const cleanParam = urlFestivalParam.toLowerCase().trim();
            matched = safeFests.find(f => 
              (f.slug && f.slug.toLowerCase() === cleanParam) ||
              (f.name && f.name.toLowerCase().includes(cleanParam)) ||
              (f._id && f._id.toString() === cleanParam)
            );
          }

          if (matched && matched.isPreOrderOpen !== false) {
            setSelectedFestival(matched._id);
          } else {
            const firstOpen = safeFests.find((f) => f.isPreOrderOpen !== false) || safeFests[0];
            setSelectedFestival(firstOpen._id);
          }
        }
      } catch (err) {
        console.error('Failed to fetch pre-order data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [urlFestivalParam]);

  // Auto-set date range based on selected festival
  const activeFest = useMemo(
    () => festivals.find((f) => f._id === selectedFestival),
    [festivals, selectedFestival]
  );

  const dateConstraints = useMemo(() => {
    if (!activeFest) return {};
    const start = activeFest.startDate ? new Date(activeFest.startDate).toISOString().split('T')[0] : '';
    const end = activeFest.endDate ? new Date(activeFest.endDate).toISOString().split('T')[0] : start;
    return { min: start, max: end };
  }, [activeFest]);

  // If festival changes, reset selected date if out of range
  useEffect(() => {
    if (activeFest?.startDate) {
      const startStr = new Date(activeFest.startDate).toISOString().split('T')[0];
      setDate(startStr);
    }
  }, [selectedFestival]);

  const handleProductQuantity = (id, change) => {
    setSelectedProducts((prev) => {
      const current = prev[id] || 0;
      const next = current + change;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  const selectedCount = Object.keys(selectedProducts).length;

  const calculateTotal = () => {
    return Object.entries(selectedProducts).reduce((sum, [id, qty]) => {
      const p = products.find((prod) => prod._id === id);
      return sum + (p ? p.price * qty : 0);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to place a pre-order');
      navigate('/login?returnUrl=/pre-order');
      return;
    }

    if (selectedCount === 0) {
      toast.error('Please select at least one product');
      return;
    }

    if (!date) {
      toast.error('Please select a pickup/delivery date');
      return;
    }

    if (activeFest && activeFest.isPreOrderOpen === false) {
      toast.error(`Pre-orders for ${activeFest.name} are currently closed.`);
      return;
    }

    setSubmitting(true);
    try {
      const capRes = await checkCapacity({ date, time });
      if (capRes.data?.isFull || capRes.data?.data?.isFull) {
        toast.error('Capacity full for this date/time. Please select another slot.');
        setSubmitting(false);
        return;
      }

      const items = Object.entries(selectedProducts).map(([id, qty]) => {
        const p = products.find((prod) => prod._id === id);
        return { product: id, quantity: qty, price: p.price };
      });

      const festivalName = activeFest?.name || 'Festival Special';

      const orderData = {
        festival: festivalName,
        festivalRef: activeFest?._id,
        items,
        scheduledDate: date,
        scheduledTime: time,
        fulfillmentType,
        notes,
      };

      const res = await createPreOrder(orderData);
      const createdId = res.data?._id || res.data?.data?._id;
      toast.success('Pre-order placed successfully! 🎉');
      navigate(createdId ? `/orders/${createdId}` : '/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place pre-order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  // ─── Empty state ───
  if (festivals.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8DDD4] p-10">
          <div className="text-6xl mb-4">🎪</div>
          <h2 className="text-3xl font-bold text-[#9B2335] font-serif mb-3">Festival Pre-Orders</h2>
          <p className="text-[#6B4F3A] text-lg mb-6">
            No upcoming festivals at the moment. Pre-orders open automatically before each festival.
          </p>
        </div>
      </div>
    );
  }

  const total = calculateTotal();

  // ─── Main form ───
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#D4A017]/20 text-[#855e09] mb-2">
          <HiSparkles className="w-3.5 h-3.5" /> Sri Ram Sweets (Vinay Hotel)
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#9B2335] font-serif mb-2">
          Bihar & National Festival Pre-Orders
        </h1>
        <p className="text-[#6B4F3A] max-w-xl mx-auto text-sm sm:text-base">
          Reserve your authentic festival sweets, Chhath Thekua, Diwali gifts, and puja bhog in advance to guarantee fresh availability!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1 – Choose Festival */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-[#9B2335] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow">1</span>
            <div>
              <h3 className="text-xl font-bold text-[#2C1810]">Choose Festival</h3>
              <p className="text-xs text-[#6B4F3A]">Select which festive celebration you are ordering for</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {festivals.map((f) => (
              <FestivalCard
                key={f._id}
                festival={f}
                isSelected={selectedFestival === f._id}
                onSelect={setSelectedFestival}
              />
            ))}
          </div>
        </section>

        {/* Step 2 – Select Sweets */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-[#9B2335] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow">2</span>
            <div>
              <h3 className="text-xl font-bold text-[#2C1810]">Select Sweets & Offerings</h3>
              <p className="text-xs text-[#6B4F3A]">Choose festival specials prepared with pure Desi Ghee</p>
            </div>
            {selectedCount > 0 && (
              <span className="ml-auto text-xs font-semibold text-[#9B2335] bg-red-100/80 px-3 py-1 rounded-full border border-red-200">
                {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
              </span>
            )}
          </div>
          {products.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#E8DDD4] p-8 text-center text-[#6B4F3A]">
              No products available for pre-order right now.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  qty={selectedProducts[product._id] || 0}
                  onQuantityChange={handleProductQuantity}
                />
              ))}
            </div>
          )}
        </section>

        {/* Step 3 – Schedule */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-[#9B2335] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow">3</span>
            <div>
              <h3 className="text-xl font-bold text-[#2C1810]">Schedule Pickup / Delivery</h3>
              <p className="text-xs text-[#6B4F3A]">Select your preferred date within the festival celebration window</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-[#E8DDD4] p-5 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-[#6B4F3A] mb-1.5">
                  Fulfillment Date *
                  {activeFest && (
                    <span className="text-[10px] text-[#9B2335] block font-normal">
                      Allowed: {dateConstraints.min || 'Any'} to {dateConstraints.max || 'Any'}
                    </span>
                  )}
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  min={dateConstraints.min}
                  max={dateConstraints.max}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#E8DDD4] rounded-lg focus:ring-2 focus:ring-[#9B2335] focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6B4F3A] mb-1.5">Time Slot *</label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#E8DDD4] rounded-lg focus:ring-2 focus:ring-[#9B2335] focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6B4F3A] mb-1.5">Fulfillment Method *</label>
                <select
                  value={fulfillmentType}
                  onChange={(e) => setFulfillmentType(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#E8DDD4] rounded-lg focus:ring-2 focus:ring-[#9B2335] focus:outline-none text-sm bg-white"
                >
                  <option value="pickup">Counter Pickup (Free)</option>
                  <option value="delivery">Home Delivery</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-[#6B4F3A] mb-1.5">Special Instructions / Ritual Notes (Optional)</label>
              <textarea
                rows="2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="E.g., packaging for puja Arghya, separate bags for prasad..."
                className="w-full px-3.5 py-2 border border-[#E8DDD4] rounded-lg focus:ring-2 focus:ring-[#9B2335] focus:outline-none text-sm"
              />
            </div>
          </div>
        </section>

        {/* Order Summary & Submit Bar */}
        <div className="sticky bottom-4 z-20 bg-white rounded-2xl shadow-xl border border-[#E8DDD4] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-[#6B4F3A] block">Estimated Total ({selectedCount} item{selectedCount !== 1 ? 's' : ''})</span>
            <span className="text-2xl font-bold text-[#9B2335]">{formatPrice(total)}</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="submit"
              disabled={submitting || selectedCount === 0 || (activeFest && activeFest.isPreOrderOpen === false)}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#9B2335] text-white font-bold rounded-xl hover:bg-[#7A1B29] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {submitting ? 'Confirming Pre-Order...' : 'Place Festival Pre-Order →'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PreOrder;
