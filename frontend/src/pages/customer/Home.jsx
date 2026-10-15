import React, { useEffect, useState } from 'react';
import Hero from '../../components/home/Hero';
import FestivalHeroBanner from '../../components/home/FestivalHeroBanner';
import FeaturedProducts from '../../components/home/FeaturedProducts';
import WhyOrderDirect from '../../components/home/WhyOrderDirect';
import { getProducts } from '../../api/products';
import { getLiveFestivalBanner } from '../../api/festivals';
import { getFestivals } from '../../api/preOrders';
import Loading from '../../components/common/Loading';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [liveFestival, setLiveFestival] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [productsRes, liveFestRes] = await Promise.all([
          getProducts({ featured: true, limit: 8 }),
          getLiveFestivalBanner().catch(() => ({ data: { data: null } }))
        ]);

        const prodList = productsRes.data?.products || productsRes.data?.data || productsRes.data || [];
        setFeaturedProducts(Array.isArray(prodList) ? prodList : []);

        let festivalData = liveFestRes.data?.data;
        // Fallback to preOrders active festivals if live endpoint returned nothing
        if (!festivalData) {
          try {
            const fallbackRes = await getFestivals();
            const list = fallbackRes.data?.data || fallbackRes.data || [];
            if (Array.isArray(list) && list.length > 0) {
              festivalData = list[0];
            }
          } catch (e) {}
        }
        setLiveFestival(festivalData);
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
      {/* If live festival banner is active and configured, show dynamic FestivalHeroBanner; otherwise standard Hero */}
      {liveFestival && liveFestival.banner?.enabled !== false ? (
        <FestivalHeroBanner festival={liveFestival} />
      ) : (
        <Hero />
      )}
      <FeaturedProducts products={featuredProducts} />
      <WhyOrderDirect />
    </div>
  );
};

export default Home;
