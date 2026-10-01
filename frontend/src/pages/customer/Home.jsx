import React, { useEffect, useState } from 'react';
import Hero from '../../components/home/Hero';
import FeaturedProducts from '../../components/home/FeaturedProducts';
import WhyOrderDirect from '../../components/home/WhyOrderDirect';
import FestivalBanner from '../../components/home/FestivalBanner';
import { getProducts, getPublicSettings } from '../../api/products';
import { getFestivals } from '../../api/preOrders';
import Loading from '../../components/common/Loading';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [productsRes, festivalsRes] = await Promise.all([
          getProducts({ featured: true, limit: 8 }),
          getFestivals().catch(() => ({ data: [] })) // Fallback if no preOrders setup
        ]);
        const prodList = productsRes.data?.products || productsRes.data?.data || productsRes.data || [];
        setFeaturedProducts(Array.isArray(prodList) ? prodList : []);
        const festList = festivalsRes.data?.data || festivalsRes.data || [];
        setFestivals(Array.isArray(festList) ? festList : []);
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="flex flex-col min-h-screen">
      <FestivalBanner festivals={festivals} />
      <Hero />
      <FeaturedProducts products={featuredProducts} />
      <WhyOrderDirect />
    </div>
  );
};

export default Home;
