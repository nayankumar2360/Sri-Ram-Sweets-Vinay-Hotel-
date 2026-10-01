import React, { useEffect, useState } from 'react';
import { getProducts, getCategories } from '../../api/products';
import ProductCard from '../../components/menu/ProductCard';
import CategoryFilter from '../../components/menu/CategoryFilter';
import Loading from '../../components/common/Loading';

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        const prodList = productsRes.data?.products || productsRes.data?.data || productsRes.data || [];
        setProducts(Array.isArray(prodList) ? prodList : []);
        const catList = categoriesRes.data?.data || categoriesRes.data || [];
        setCategories(Array.isArray(catList) ? catList : []);
      } catch (error) {
        console.error('Failed to fetch menu data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenuData();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || 
      (typeof product.category === 'object' ? product.category._id === activeCategory : product.category === activeCategory);
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-primary font-serif">Our Menu</h1>
        <div className="mt-2 w-24 h-1 bg-secondary mx-auto rounded"></div>
      </div>

      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-secondary text-lg">No products found matching your criteria.</p>
          <button
            onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
            className="mt-4 text-primary hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;
