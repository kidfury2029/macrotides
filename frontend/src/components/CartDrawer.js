import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash, ShoppingCart } from '@phosphor-icons/react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer({ isOpen, onClose }) {
  const { 
    cartItems, 
    cartTotal, 
    shippingCost, 
    finalTotal,
    updateQuantity, 
    removeFromCart 
  } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50"
            data-testid="cart-backdrop"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-surface border-l border-primary/15 z-50 flex flex-col"
            data-testid="cart-drawer"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-primary/15">
              <h2 className="font-heading text-2xl text-text-primary flex items-center gap-3">
                <ShoppingCart weight="duotone" className="text-primary" />
                Your Cart
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-text-secondary hover:text-primary transition-colors"
                data-testid="close-cart-button"
                aria-label="Close cart"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingCart size={64} weight="duotone" className="text-text-secondary/30 mb-4" />
                  <p className="text-text-secondary font-body">Your cart is empty</p>
                  <p className="text-text-secondary/60 text-sm mt-2">Add some research peptides to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.product_id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex gap-4 p-4 bg-background/50 border border-primary/10 rounded"
                      data-testid={`cart-item-${item.product_id}`}
                    >
                      {/* Image */}
                      <div className="w-20 h-20 bg-surface rounded overflow-hidden flex-shrink-0">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading text-lg text-text-primary truncate">{item.name}</h3>
                        <p className="text-primary font-semibold mt-1">${item.price.toFixed(2)}</p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                            className="qty-btn"
                            data-testid={`decrease-qty-${item.product_id}`}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center font-body text-text-primary">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                            className="qty-btn"
                            data-testid={`increase-qty-${item.product_id}`}
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.product_id)}
                            className="ml-auto p-2 text-error hover:bg-error/10 transition-colors rounded"
                            data-testid={`remove-item-${item.product_id}`}
                            aria-label="Remove item"
                          >
                            <Trash size={18} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-primary/15 space-y-4">
                {/* Totals */}
                <div className="space-y-2 font-body">
                  <div className="flex justify-between text-text-secondary">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>Shipping</span>
                    <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
                  </div>
                  {cartTotal < 100 && (
                    <p className="text-xs text-primary">
                      Add ${(100 - cartTotal).toFixed(2)} more for free shipping!
                    </p>
                  )}
                  <div className="flex justify-between text-text-primary font-semibold text-lg pt-2 border-t border-primary/10">
                    <span>Total</span>
                    <span className="text-primary">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full py-4 btn-primary btn-press"
                  data-testid="checkout-button"
                >
                  PROCEED TO CHECKOUT
                </button>

                {/* Research Disclaimer */}
                <p className="text-xs text-text-secondary text-center">
                  All products are sold for research purposes only
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
