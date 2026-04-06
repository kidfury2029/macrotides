import { motion } from 'framer-motion';
import { ShoppingCart, Flask, Check } from '@phosphor-icons/react';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

export default function ProductCard({ product, index }) {
  const { addToCart, cartItems } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const isInCart = cartItems.some(item => item.product_id === product.id);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="product-card rounded overflow-hidden group"
      data-testid={`product-card-${product.id}`}
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-surface overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="product-image w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-secondary/80 backdrop-blur-sm text-xs text-text-primary uppercase tracking-wider font-semibold rounded">
            {product.category}
          </span>
        </div>

        {/* Purity Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 bg-primary text-background text-xs font-bold rounded">
            {product.purity}
          </span>
        </div>

        {/* Quick Add Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-background/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="px-6 py-3 btn-primary btn-press flex items-center gap-2"
            data-testid={`quick-add-${product.id}`}
          >
            {isAdding ? (
              <>
                <Check size={18} weight="bold" />
                ADDED
              </>
            ) : (
              <>
                <ShoppingCart size={18} weight="bold" />
                ADD TO CART
              </>
            )}
          </button>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-heading text-xl text-text-primary group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <Flask size={20} weight="duotone" className="text-primary flex-shrink-0 mt-1" />
        </div>

        {/* Description */}
        <p className="font-body text-sm text-text-secondary line-clamp-2 mb-4">
          {product.description}
        </p>

        {/* Size */}
        <p className="text-xs text-text-secondary/70 uppercase tracking-wider mb-4">
          Size: {product.size}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-heading text-primary">
            ${product.price.toFixed(2)}
          </span>
          
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`px-4 py-2 text-sm font-semibold transition-all ${
              isInCart
                ? 'bg-success/20 text-success border border-success/30'
                : 'btn-secondary'
            }`}
            data-testid={`add-to-cart-${product.id}`}
          >
            {isInCart ? 'IN CART' : 'ADD'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
