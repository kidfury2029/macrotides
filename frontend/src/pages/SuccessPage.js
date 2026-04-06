import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Flask, Spinner, EnvelopeSimple, Package } from '@phosphor-icons/react';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState('loading');
  const [orderDetails, setOrderDetails] = useState(null);
  const { clearCart } = useCart();

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      return;
    }

    let attempts = 0;
    const maxAttempts = 5;

    const pollPaymentStatus = async () => {
      try {
        const response = await axios.get(`${API}/checkout/status/${sessionId}`);
        
        if (response.data.payment_status === 'paid') {
          setStatus('success');
          setOrderDetails(response.data);
          clearCart(); // Clear cart on successful payment
          return;
        } else if (response.data.status === 'expired') {
          setStatus('expired');
          return;
        }

        // Continue polling
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(pollPaymentStatus, 2000);
        } else {
          setStatus('pending');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(pollPaymentStatus, 2000);
        } else {
          setStatus('error');
        }
      }
    };

    pollPaymentStatus();
  }, [sessionId, clearCart]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4" data-testid="success-page">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full text-center"
      >
        {/* Loading State */}
        {status === 'loading' && (
          <div data-testid="loading-state">
            <Spinner size={64} className="text-primary animate-spin mx-auto mb-6" />
            <h1 className="font-heading text-3xl text-text-primary mb-4">
              Processing Payment...
            </h1>
            <p className="text-text-secondary">
              Please wait while we confirm your payment.
            </p>
          </div>
        )}

        {/* Success State */}
        {status === 'success' && (
          <div data-testid="success-state">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
            >
              <CheckCircle size={80} weight="duotone" className="text-success mx-auto mb-6" />
            </motion.div>
            
            <h1 className="font-heading text-3xl sm:text-4xl text-text-primary mb-4">
              Order Confirmed!
            </h1>
            <p className="text-text-secondary mb-8">
              Thank you for your order. Your research peptides will be shipped shortly.
            </p>

            {orderDetails && (
              <div className="bg-surface border border-primary/15 rounded p-6 mb-8 text-left">
                <h3 className="font-heading text-lg text-text-primary mb-4">Order Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Order Total:</span>
                    <span className="text-primary font-semibold">
                      ${(orderDetails.amount_total / 100).toFixed(2)} {orderDetails.currency?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Payment Status:</span>
                    <span className="text-success font-semibold">Paid</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center justify-center gap-2 text-text-secondary text-sm">
                <EnvelopeSimple size={18} className="text-primary" />
                Confirmation email sent
              </div>
              <div className="flex items-center justify-center gap-2 text-text-secondary text-sm">
                <Package size={18} className="text-primary" />
                Shipping within 1-2 days
              </div>
            </div>

            <Link 
              to="/" 
              className="inline-flex items-center gap-2 px-8 py-4 btn-primary mt-8"
              data-testid="continue-shopping-button"
            >
              <Flask size={18} />
              Continue Shopping
            </Link>
          </div>
        )}

        {/* Pending State */}
        {status === 'pending' && (
          <div data-testid="pending-state">
            <Spinner size={64} className="text-warning mx-auto mb-6" />
            <h1 className="font-heading text-3xl text-text-primary mb-4">
              Payment Processing
            </h1>
            <p className="text-text-secondary mb-8">
              Your payment is still being processed. You will receive an email confirmation once complete.
            </p>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 px-8 py-4 btn-secondary"
            >
              Return to Shop
            </Link>
          </div>
        )}

        {/* Error State */}
        {(status === 'error' || status === 'expired') && (
          <div data-testid="error-state">
            <Flask size={64} weight="duotone" className="text-error mx-auto mb-6" />
            <h1 className="font-heading text-3xl text-text-primary mb-4">
              {status === 'expired' ? 'Session Expired' : 'Something Went Wrong'}
            </h1>
            <p className="text-text-secondary mb-8">
              {status === 'expired' 
                ? 'Your payment session has expired. Please try again.'
                : 'We couldn\'t verify your payment. Please contact support if you were charged.'}
            </p>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 px-8 py-4 btn-primary"
            >
              Return to Shop
            </Link>
          </div>
        )}

        {/* Research Disclaimer */}
        <p className="text-xs text-text-secondary mt-12">
          All products are for research purposes only. Not for human consumption.
        </p>
      </motion.div>
    </div>
  );
}
