import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Flask, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  CreditCard,
  Spinner,
  WarningCircle
} from '@phosphor-icons/react';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function CheckoutPage() {
  const { cartItems, cartTotal, shippingCost, finalTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'United States'
  });
  const [errors, setErrors] = useState({});

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <Flask size={64} weight="duotone" className="text-primary/30 mx-auto mb-4" />
          <h2 className="font-heading text-2xl text-text-primary mb-2">Your Cart is Empty</h2>
          <p className="text-text-secondary mb-6">Add some research peptides to continue</p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-6 py-3 btn-primary"
            data-testid="back-to-shop-link"
          >
            <ArrowLeft size={18} />
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.address_line1.trim()) newErrors.address_line1 = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.postal_code.trim()) newErrors.postal_code = 'Postal code is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API}/checkout/create-session`, {
        cart_items: cartItems,
        shipping_address: formData,
        origin_url: window.location.origin
      });

      if (response.data.checkout_url) {
        // Redirect to Stripe Checkout
        window.location.href = response.data.checkout_url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to create checkout session. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background" data-testid="checkout-page">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/70 backdrop-blur-xl border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <Flask size={24} weight="duotone" className="text-primary" />
              <span className="font-heading text-xl text-text-primary">
                Macro<span className="text-primary">tides</span>
              </span>
            </Link>
            <Link 
              to="/" 
              className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors"
              data-testid="continue-shopping-link"
            >
              <ArrowLeft size={18} />
              <span className="text-sm">Continue Shopping</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-3xl sm:text-4xl text-text-primary mb-8"
        >
          Checkout
        </motion.h1>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6" data-testid="checkout-form">
              {/* Contact Information */}
              <div className="space-y-4">
                <h2 className="font-heading text-xl text-text-primary flex items-center gap-2">
                  <CreditCard size={20} className="text-primary" />
                  Contact Information
                </h2>
                
                <div>
                  <label className="block text-sm text-text-secondary mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`checkout-input ${errors.email ? 'border-error' : ''}`}
                    placeholder="researcher@institution.edu"
                    data-testid="email-input"
                  />
                  {errors.email && (
                    <p className="text-error text-xs mt-1 flex items-center gap-1">
                      <WarningCircle size={14} /> {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="space-y-4 pt-6 border-t border-primary/10">
                <h2 className="font-heading text-xl text-text-primary flex items-center gap-2">
                  <Truck size={20} className="text-primary" />
                  Shipping Address
                </h2>

                <div>
                  <label className="block text-sm text-text-secondary mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className={`checkout-input ${errors.full_name ? 'border-error' : ''}`}
                    placeholder="Dr. Jane Smith"
                    data-testid="full-name-input"
                  />
                  {errors.full_name && (
                    <p className="text-error text-xs mt-1 flex items-center gap-1">
                      <WarningCircle size={14} /> {errors.full_name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-text-secondary mb-2">Address Line 1 *</label>
                  <input
                    type="text"
                    name="address_line1"
                    value={formData.address_line1}
                    onChange={handleInputChange}
                    className={`checkout-input ${errors.address_line1 ? 'border-error' : ''}`}
                    placeholder="123 Research Blvd"
                    data-testid="address-line1-input"
                  />
                  {errors.address_line1 && (
                    <p className="text-error text-xs mt-1 flex items-center gap-1">
                      <WarningCircle size={14} /> {errors.address_line1}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-text-secondary mb-2">Address Line 2</label>
                  <input
                    type="text"
                    name="address_line2"
                    value={formData.address_line2}
                    onChange={handleInputChange}
                    className="checkout-input"
                    placeholder="Suite 100, Lab Building"
                    data-testid="address-line2-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-text-secondary mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`checkout-input ${errors.city ? 'border-error' : ''}`}
                      placeholder="Science City"
                      data-testid="city-input"
                    />
                    {errors.city && (
                      <p className="text-error text-xs mt-1 flex items-center gap-1">
                        <WarningCircle size={14} /> {errors.city}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-2">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={`checkout-input ${errors.state ? 'border-error' : ''}`}
                      placeholder="CA"
                      data-testid="state-input"
                    />
                    {errors.state && (
                      <p className="text-error text-xs mt-1 flex items-center gap-1">
                        <WarningCircle size={14} /> {errors.state}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-text-secondary mb-2">Postal Code *</label>
                    <input
                      type="text"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleInputChange}
                      className={`checkout-input ${errors.postal_code ? 'border-error' : ''}`}
                      placeholder="12345"
                      data-testid="postal-code-input"
                    />
                    {errors.postal_code && (
                      <p className="text-error text-xs mt-1 flex items-center gap-1">
                        <WarningCircle size={14} /> {errors.postal_code}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-2">Country</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="checkout-input"
                      data-testid="country-select"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Research Acknowledgment */}
              <div className="p-4 bg-secondary/20 border border-primary/10 rounded">
                <p className="text-xs text-text-secondary">
                  <strong className="text-primary">Research Use Only:</strong> By proceeding with this purchase, 
                  I confirm that all products are being purchased for legitimate research purposes only and 
                  will not be used for human or animal consumption.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 btn-primary btn-press flex items-center justify-center gap-2 disabled:opacity-50"
                data-testid="submit-checkout-button"
              >
                {loading ? (
                  <>
                    <Spinner size={20} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={20} />
                    PROCEED TO PAYMENT - ${finalTotal.toFixed(2)}
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="sticky top-24 bg-surface border border-primary/15 rounded p-6">
              <h2 className="font-heading text-xl text-text-primary mb-6">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-4 max-h-80 overflow-y-auto mb-6">
                {cartItems.map((item) => (
                  <div 
                    key={item.product_id} 
                    className="flex gap-4"
                    data-testid={`summary-item-${item.product_id}`}
                  >
                    <div className="w-16 h-16 bg-background rounded overflow-hidden flex-shrink-0">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-heading text-text-primary truncate">{item.name}</h4>
                      <p className="text-sm text-text-secondary">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-primary font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-primary/10 pt-4 space-y-3">
                <div className="flex justify-between text-text-secondary">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Shipping</span>
                  <span className={shippingCost === 0 ? 'text-success' : ''}>
                    {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-text-primary pt-3 border-t border-primary/10">
                  <span>Total</span>
                  <span className="text-primary">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-primary/10 flex flex-wrap gap-4 justify-center">
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <ShieldCheck size={16} className="text-primary" />
                  Secure Payment
                </div>
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <Truck size={16} className="text-primary" />
                  Discrete Shipping
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
