import { motion } from 'framer-motion';
import { ArrowDown, Flask, ShieldCheck, Truck } from '@phosphor-icons/react';

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden" data-testid="hero-section">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1662948496624-669ce77ed50d?w=1920&q=80)'
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="hero-gradient absolute inset-0" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/30 border border-primary/20 rounded-full mb-8"
          >
            <Flask size={16} weight="duotone" className="text-primary" />
            <span className="text-sm text-text-primary tracking-wide">Premium Research Grade Peptides</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-heading text-5xl sm:text-6xl lg:text-7xl text-text-primary tracking-tighter leading-none mb-6"
          >
            Advancing{' '}
            <span className="text-gradient-gold">Scientific</span>
            <br />
            Discovery
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-body text-lg sm:text-xl text-text-secondary max-w-xl mb-10 leading-relaxed"
          >
            Premium quality peptides for research institutions and laboratories. 
            99%+ purity verified through rigorous third-party testing.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4"
          >
            <a
              href="#products"
              className="px-8 py-4 btn-primary btn-press inline-flex items-center gap-2"
              data-testid="explore-products-btn"
            >
              EXPLORE PRODUCTS
              <ArrowDown size={18} weight="bold" />
            </a>
            <a
              href="#about"
              className="px-8 py-4 btn-secondary btn-press"
              data-testid="learn-more-btn"
            >
              LEARN MORE
            </a>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap gap-6 mt-12 pt-8 border-t border-primary/10"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck size={24} weight="duotone" className="text-primary" />
              <span className="text-sm text-text-secondary">99%+ Purity</span>
            </div>
            <div className="flex items-center gap-3">
              <Flask size={24} weight="duotone" className="text-primary" />
              <span className="text-sm text-text-secondary">Lab Tested</span>
            </div>
            <div className="flex items-center gap-3">
              <Truck size={24} weight="duotone" className="text-primary" />
              <span className="text-sm text-text-secondary">Discrete Shipping</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-primary/50"
        >
          <ArrowDown size={24} />
        </motion.div>
      </motion.div>
    </section>
  );
}
