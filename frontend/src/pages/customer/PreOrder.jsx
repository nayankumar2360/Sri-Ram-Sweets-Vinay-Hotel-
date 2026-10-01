import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFestivals, checkCapacity, createPreOrder } from '../../api/preOrders';
import { getProducts } from '../../api/products';
import { useAuth } from '../../hooks/useAuth';
import Loading from '../../components/common/Loading';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/formatters';

const PreOrder = () => {
  const [festivals, setFestivals] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedFestival, setSelectedFestival] = useState('');
  const [selectedProducts, setSelectedProducts] = useState({}); // { id: quantity }
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [fulfillmentType, setFulfillmentType] = useState('pickup');
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [festRes, prodRes] = await Promise.all([
          getFestivals(),
          getProducts({ preorderEnabled: true })
        ]);
        const festList = festRes.data?.data || festRes.data || [];
        setFestivals(Array.isArray(festList) ? festList : []);
        const rawProds = prodRes.data?.products || prodRes.data?.data || prodRes.data || [];
        const prods = Array.isArray(rawProds) ? rawProds : [];
        setProducts(prods.filter(p => p.preorderEnabled));
        if (festList.length > 0) {
          setSelectedFestival(festList[0].name || festList[0]._id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleProductQuantity = (id, change) => {
    setSelectedProducts(prev => {
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

  const calculateTotal = () => {
    return Object.entries(selectedProducts).reduce((sum, [id, qty]) => {
      const p = products.find(prod => prod._id === id);
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
    
    if (Object.keys(selectedProducts).length === 0) {
      toast.error('Please select at least one product');
      return;
    }

    try {
      // Check capacity first
      const capRes = await checkCapacity({ date, time });
      if (capRes.data.isFull) {
        toast.error('Capacity full for this date/time. Please select another slot.');
        return;
      }

      const items = Object.entries(selectedProducts).map(([id, qty]) => {
        const p = products.find(prod => prod._id === id);
        return { product: id, quantity: qty, price: p.price };
      });

      const orderData = {
        festival: selectedFestival,
        items,
        scheduledDate: date,
        scheduledTime: time,
        fulfillmentType
      };

      const createdId = res.data?._id || res.data?.data?._id;
      toast.success('Pre-order placed successfully!');
      navigate(createdId ? `/orders/${createdId}` : '/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place pre-order');
    }
  };

  if (loading) return <Loading />;

  if (festivals.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-primary font-serif mb-4">Festival Pre-Orders</h2>
        <p className="text-text-secondary text-lg">No active festivals for pre-ordering at the moment.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-primary font-serif mb-8 text-center">Festival Pre-Order</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Step 1 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
          <h3 className="text-xl font-semibold mb-4 border-b border-border pb-2">1. Select Festival</h3>
          <select 
            required
            value={selectedFestival} 
            onChange={e => setSelectedFestival(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-md focus:ring-primary focus:border-primary"
          >
            {festivals.map(f => (
              <option key={f._id} value={f._id}>{f.name} ({new Date(f.startDate).toLocaleDateString()} - {new Date(f.endDate).toLocaleDateString()})</option>
            ))}
          </select>
        </div>

        {/* Step 2 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
          <h3 className="text-xl font-semibold mb-4 border-b border-border pb-2">2. Select Sweets</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map(product => {
              const qty = selectedProducts[product._id] || 0;
              return (
                <div key={product._id} className="flex items-center justify-between p-4 border border-border rounded-md">
                  <div>
                    <h4 className="font-semibold">{product.name}</h4>
                    <p className="text-sm text-text-secondary">{formatPrice(product.price)} / {product.unit}</p>
                  </div>
                  <div className="flex items-center space-x-3 bg-cream rounded-md p-1 border border-border">
                    <button type="button" onClick={() => handleProductQuantity(product._id, -1)} className="px-2 font-bold text-primary hover:bg-white rounded">-</button>
                    <span className="w-4 text-center font-medium">{qty}</span>
                    <button type="button" onClick={() => handleProductQuantity(product._id, 1)} className="px-2 font-bold text-primary hover:bg-white rounded">+</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
          <h3 className="text-xl font-semibold mb-4 border-b border-border pb-2">3. Schedule Pickup/Delivery</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Date *</label>
              <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-2 border border-border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Time *</label>
              <input type="time" required value={time} onChange={e => setTime(e.target.value)} className="w-full px-4 py-2 border border-border rounded-md" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Fulfillment *</label>
              <select value={fulfillmentType} onChange={e => setFulfillmentType(e.target.value)} className="w-full px-4 py-2 border border-border rounded-md">
                <option value="pickup">Store Pickup</option>
                <option value="delivery">Home Delivery</option>
              </select>
            </div>
          </div>
        </div>

        {/* Total & Submit */}
        <div className="bg-cream p-6 rounded-lg border border-secondary text-center">
          <div className="text-xl font-bold mb-4">Total: <span className="text-primary text-2xl ml-2">{formatPrice(calculateTotal())}</span></div>
          <button type="submit" className="px-8 py-3 bg-primary text-white font-bold rounded-md shadow hover:bg-primary-dark transition-colors">
            Place Pre-Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default PreOrder;
