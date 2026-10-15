import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFestivals, checkCapacity, createPreOrder } from '../../api/preOrders';
import { getProducts } from '../../api/products';
import { useAuth } from '../../hooks/useAuth';
import Loading from '../../components/common/Loading';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/formatters';

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
    <div className="flex justify-center gap-3">
      {units.map((u) => (
        <div key={u.label} className="flex flex-col items-center">
          <div className="bg-primary text-white text-xl sm:text-2xl font-bold w-14 h-14 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center shadow-md">
            {String(u.value || 0).padStart(2, '0')}
          </div>
          <span className="text-xs text-text-secondary mt-1 font-medium">{u.label}</span>
        </div>
      ))}
    </div>
  );
};

// Festival Card component
const FestivalCard = ({ festival, isSelected, onSelect }) => {
  const startDate = festival.startDate ? new Date(festival.startDate) : null;
  const endDate = festival.endDate ? new Date(festival.endDate) : startDate;
  const isOpen = festival.isPreOrderOpen !== false;

  const formatFestDate = (d) =>
    d ? d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

  return (
    <div
      onClick={() => isOpen && onSelect(festival._id)}
      className={`relative rounded-xl border-2 p-5 transition-all duration-200 ${
        !isOpen
          ? 'border-border bg-gray-50/80 cursor-not-allowed opacity-80'
          : isSelected
          ? 'border-primary bg-red-50 shadow-md ring-2 ring-primary/20 cursor-pointer'
          : 'border-border bg-white hover:border-primary/40 hover:shadow-md cursor-pointer'
      }`}
    >
      {isSelected && isOpen && (
        <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shadow">
          ✓
        </div>
      )}

      <div className="flex items-start justify-between mb-3 gap-2">
        <div>
          <h3 className="text-lg font-bold text-primary font-serif">{festival.name}</h3>
          {startDate && (
            <p className="text-sm text-text-secondary mt-0.5">
              📅 {formatFestDate(startDate)}
              {endDate && endDate.getTime() !== startDate.getTime() && ` — ${formatFestDate(endDate)}`}
            </p>
          )}
        </div>
        <div>
          {festival.isOngoing ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Ongoing
            </span>
          ) : isOpen ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
              ● Pre-Orders Open
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
              Opens in {festival.daysUntilPreOrder}d
            </span>
          )}
        </div>
      </div>

      {festival.description && (
        <p className="text-sm text-text-secondary mb-3">{festival.description}</p>
      )}

      {/* Status banner / countdown */}
      {isOpen ? (
        startDate && festival.daysUntilFestival > 0 && (
          <div className="mt-3 pt-3 border-t border-border/60">
            <p className="text-xs text-text-secondary text-center mb-2 font-medium">Festival starts in</p>
            <CountdownTimer targetDate={festival.startDate} />
          </div>
        )
      ) : (
        <div className="mt-3 pt-3 border-t border-dashed border-border text-center text-xs text-amber-800 bg-amber-50 p-2.5 rounded-lg">
          ⏳ Pre-orders open <strong>5 days</strong> prior ({formatFestDate(new Date(festival.preOrderOpensOn))})
        </div>
      )}
    </div>
  );
};

// Product selector card
const ProductCard = ({ product, qty, onQuantityChange }) => {
  return (
    <div className={`rounded-xl border-2 p-4 transition-all duration-200 ${
      qty > 0 ? 'border-primary bg-red-50/50 shadow-sm' : 'border-border bg-white'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-[#2C1810] truncate">{product.name}</h4>
          <p className="text-sm text-primary font-medium mt-0.5">
            {formatPrice(product.price)}
            <span className="text-text-secondary font-normal"> / {product.unit}</span>
          </p>
        </div>
        <div className="flex items-center gap-1 ml-4">
          {qty > 0 && (
            <button
              type="button"
              onClick={() => onQuantityChange(product._id, -1)}
              className="w-8 h-8 rounded-lg bg-white border border-border text-primary font-bold hover:bg-red-50 transition-colors flex items-center justify-center text-lg"
            >
              −
            </button>
          )}
          {qty > 0 && (
            <span className="w-10 text-center font-bold text-lg text-primary">{qty}</span>
          )}
          <button
            type="button"
            onClick={() => onQuantityChange(product._id, 1)}
            className={`w-8 h-8 rounded-lg font-bold transition-colors flex items-center justify-center text-lg ${
              qty > 0
                ? 'bg-white border border-border text-primary hover:bg-red-50'
                : 'bg-primary text-white hover:bg-primary-dark shadow-sm'
            }`}
          >
            +
          </button>
        </div>
      </div>
      {qty > 0 && (
        <div className="mt-2 pt-2 border-t border-primary/10 text-sm text-right font-medium text-primary">
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [festRes, prodRes] = await Promise.all([
          getFestivals(),
          getProducts({ preorderEnabled: true }),
        ]);
        const festList = festRes.data?.data || festRes.data || [];
        const safeFests = Array.isArray(festList) ? festList : [];
        setFestivals(safeFests);

        const rawProds = prodRes.data?.products || prodRes.data?.data || prodRes.data || [];
        const prods = Array.isArray(rawProds) ? rawProds : [];
        setProducts(prods.filter((p) => p.preorderEnabled));

        if (safeFests.length > 0) {
          const firstOpen = safeFests.find((f) => f.isPreOrderOpen !== false) || safeFests[0];
          setSelectedFestival(firstOpen._id);
        }
      } catch (err) {
        console.error('Failed to fetch pre-order data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Auto-set date range based on selected festival
  const activeFest = useMemo(
    () => festivals.find((f) => f._id === selectedFestival),
    [festivals, selectedFestival]
  );

  const dateConstraints = useMemo(() => {
    if (!activeFest) return {};
    const start = activeFest.startDate?.split('T')[0];
    const end = activeFest.endDate?.split('T')[0] || start;
    return { min: start, max: end };
  }, [activeFest]);

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
      toast.error(`Pre-orders for ${activeFest.name} open 5 days before the festival.`);
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

      const festivalName = activeFest?.name || selectedFestival;

      const orderData = {
        festival: festivalName,
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
        <div className="bg-white rounded-2xl shadow-sm border border-border p-10">
          <div className="text-6xl mb-4">🎪</div>
          <h2 className="text-3xl font-bold text-primary font-serif mb-3">Festival Pre-Orders</h2>
          <p className="text-text-secondary text-lg mb-6">
            No upcoming festivals at the moment. Pre-orders open <strong>5 days</strong> before
            each festival.
          </p>
          <div className="bg-cream rounded-xl p-5 text-sm text-text-secondary space-y-2">
            <p className="font-semibold text-[#2C1810]">How it works</p>
            <div className="flex items-start gap-3 text-left">
              <span className="bg-primary/10 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs">1</span>
              <span>Pre-ordering opens automatically <strong>5 days</strong> before the festival</span>
            </div>
            <div className="flex items-start gap-3 text-left">
              <span className="bg-primary/10 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs">2</span>
              <span>Select your favourite sweets and quantities</span>
            </div>
            <div className="flex items-start gap-3 text-left">
              <span className="bg-primary/10 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs">3</span>
              <span>Choose pickup or delivery for the festival day</span>
            </div>
            <div className="flex items-start gap-3 text-left">
              <span className="bg-primary/10 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs">4</span>
              <span>Enjoy fresh sweets without the rush! 🍬</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const total = calculateTotal();

  // ─── Main form ───
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary font-serif mb-2">
          🎉 Festival Pre-Order
        </h1>
        <p className="text-text-secondary">
          Reserve your favourite sweets before the festival rush!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1 – Choose Festival */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">1</span>
            <h3 className="text-xl font-bold text-[#2C1810]">Choose Festival</h3>
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
            <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">2</span>
            <h3 className="text-xl font-bold text-[#2C1810]">Select Sweets</h3>
            {selectedCount > 0 && (
              <span className="ml-auto text-sm font-medium text-primary bg-red-50 px-3 py-1 rounded-full">
                {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
              </span>
            )}
          </div>
          {products.length === 0 ? (
            <div className="bg-white rounded-xl border border-border p-8 text-center text-text-secondary">
              No products available for pre-order right now.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">3</span>
            <h3 className="text-xl font-bold text-[#2C1810]">Schedule Pickup / Delivery</h3>
          </div>
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-[#6B4F3A] mb-1.5">Date *</label>
                <input
                  type="date"
                  required
                  value={date}
                  min={dateConstraints.min}
                  max={dateConstraints.max}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#6B4F3A] mb-1.5">Time *</label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#6B4F3A] mb-1.5">Fulfillment *</label>
                <select
                  value={fulfillmentType}
                  onChange={(e) => setFulfillmentType(e.target.value)}
                  className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="pickup">🏪 Store Pickup</option>
                  <option value="delivery">🚚 Home Delivery</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-[#6B4F3A] mb-1.5">Special Instructions (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requests for your order..."
                rows={2}
                className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>
          </div>
        </section>

        {/* Order Summary & Submit */}
        <section className="sticky bottom-4 z-10">
          <div className="bg-gradient-to-r from-primary to-[#7a1a2a] rounded-2xl p-5 shadow-xl text-white">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-white/80 text-sm">Order Total</p>
                <p className="text-3xl font-bold">{formatPrice(total)}</p>
                {selectedCount > 0 && (
                  <p className="text-white/70 text-xs mt-0.5">
                    {selectedCount} item{selectedCount !== 1 ? 's' : ''} •{' '}
                    {Object.values(selectedProducts).reduce((a, b) => a + b, 0)} units
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={submitting || selectedCount === 0}
                className="w-full sm:w-auto px-10 py-3.5 bg-white text-primary font-bold rounded-xl shadow-md hover:bg-cream transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {submitting ? (
                  <span className="flex items-center gap-2 justify-center">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Placing Order…
                  </span>
                ) : (
                  'Place Pre-Order'
                )}
              </button>
            </div>
          </div>
        </section>
      </form>
    </div>
  );
};

export default PreOrder;
