import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import ProductCard from './ProductCard';
import { Spinner, Warning } from '@phosphor-icons/react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get(`${API}/products`),
          axios.get(`${API}/categories`)
        ]);
        setProducts(productsRes.data);
        setCategories(['All', ...categoriesRes.data]);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6" id="products">
        <div className="max-w-7xl mx-auto text-center">
          <Spinner size={48} className="text-primary animate-spin mx-auto" />
          <p className="text-text-secondary mt-4">Loading products...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-4 sm:px-6" id="products">
        <div className="max-w-7xl mx-auto text-center">
          <Warning size={48} className="text-error mx-auto mb-4" />
          <p className="text-error">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6" id="products" data-testid="products-section">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm text-primary uppercase tracking-widest font-semibold">Our Catalog</span>
          <h2 className="font-heading text-3xl sm:text-4xl text-text-primary mt-3">
            Research Peptides
          </h2>
          <p className="font-body text-text-secondary max-w-2xl mx-auto mt-4">
            Premium quality peptides for scientific research. All products are third-party tested 
            for purity and authenticity.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12" id="categories" data-testid="category-tabs">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`category-tab font-body text-sm ${
                selectedCategory === category ? 'active' : ''
              }`}
              data-testid={`category-${category.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          data-testid="products-grid"
        >
          {filteredProducts.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              index={index}
            />
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-secondary">No products found in this category.</p>
          </div>
        )}

        {/* Research Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 p-6 bg-secondary/20 border border-primary/10 rounded text-center"
          data-testid="research-disclaimer"
        >
          <p className="text-sm text-text-secondary">
            <strong className="text-primary">Important:</strong> All products are intended for 
            laboratory and research use only. Not intended for human or animal consumption. 
            By purchasing, you agree that products are being used solely for research purposes.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
