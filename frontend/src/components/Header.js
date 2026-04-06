import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Flask, List, X } from '@phosphor-icons/react';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';

export default function Header() {
  const { cartCount, setIsCartOpen, isCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Products', href: '#products' },
    { name: 'Categories', href: '#categories' },
    { name: 'About', href: '#about' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <>
      {/* Disclaimer Banner */}
      <div className="disclaimer-banner py-2 px-4 text-center" data-testid="disclaimer-banner">
        <p className="text-xs sm:text-sm tracking-widest uppercase font-semibold text-text-primary">
          For Research Purposes Only — Not for Human Consumption
        </p>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-background/70 backdrop-blur-xl border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-2 sm:gap-3 group"
              data-testid="logo-link"
            >
              <Flask 
                size={28} 
                weight="duotone" 
                className="text-primary group-hover:text-primary-hover transition-colors"
              />
              <span className="font-heading text-xl sm:text-2xl font-semibold text-text-primary tracking-tight">
                Macro<span className="text-primary">tides</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="nav-link font-body text-sm font-medium"
                  data-testid={`nav-${link.name.toLowerCase()}`}
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-text-secondary hover:text-primary transition-colors"
                data-testid="cart-button"
                aria-label="Open cart"
              >
                <ShoppingCart size={24} weight="duotone" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-primary text-background text-xs font-bold rounded-full"
                    data-testid="cart-count"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-text-secondary hover:text-primary transition-colors"
                data-testid="mobile-menu-toggle"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <List size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-surface border-t border-primary/10"
            >
              <nav className="px-4 py-4 space-y-2">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-text-secondary hover:text-primary transition-colors font-body"
                  >
                    {link.name}
                  </a>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
