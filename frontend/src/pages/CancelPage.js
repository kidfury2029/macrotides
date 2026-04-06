import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, Flask, ArrowLeft } from '@phosphor-icons/react';

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4" data-testid="cancel-page">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
        >
          <XCircle size={80} weight="duotone" className="text-error mx-auto mb-6" />
        </motion.div>
        
        <h1 className="font-heading text-3xl sm:text-4xl text-text-primary mb-4">
          Payment Cancelled
        </h1>
        <p className="text-text-secondary mb-8">
          Your payment was cancelled. No charges have been made. 
          Your cart items are still saved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/checkout" 
            className="inline-flex items-center justify-center gap-2 px-8 py-4 btn-primary"
            data-testid="retry-checkout-button"
          >
            Try Again
          </Link>
          <Link 
            to="/" 
            className="inline-flex items-center justify-center gap-2 px-8 py-4 btn-secondary"
            data-testid="back-to-shop-button"
          >
            <ArrowLeft size={18} />
            Back to Shop
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-12 p-6 bg-surface border border-primary/10 rounded">
          <Flask size={32} weight="duotone" className="text-primary mx-auto mb-4" />
          <h3 className="font-heading text-lg text-text-primary mb-2">Need Help?</h3>
          <p className="text-sm text-text-secondary mb-4">
            If you're experiencing issues with payment, please contact our support team.
          </p>
          <a 
            href="mailto:support@macrotides.com" 
            className="text-primary hover:text-primary-hover transition-colors text-sm font-semibold"
          >
            support@macrotides.com
          </a>
        </div>

        {/* Research Disclaimer */}
        <p className="text-xs text-text-secondary mt-8">
          All products are for research purposes only. Not for human consumption.
        </p>
      </motion.div>
    </div>
  );
}
