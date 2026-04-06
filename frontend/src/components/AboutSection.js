import { Flask, ShieldCheck, Truck, Certificate, Atom, TestTube } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

export default function AboutSection() {
  const features = [
    {
      icon: ShieldCheck,
      title: "99%+ Purity",
      description: "All peptides undergo rigorous HPLC testing to ensure the highest purity standards."
    },
    {
      icon: Certificate,
      title: "Certificate of Analysis",
      description: "Every batch comes with detailed COA documentation for research verification."
    },
    {
      icon: TestTube,
      title: "Research Grade",
      description: "Manufactured in ISO-certified facilities following strict GMP guidelines."
    },
    {
      icon: Atom,
      title: "Scientific Support",
      description: "Access to technical documentation and peptide research resources."
    },
    {
      icon: Truck,
      title: "Discrete Shipping",
      description: "Fast, secure, and discrete worldwide shipping with tracking."
    },
    {
      icon: Flask,
      title: "Fresh Synthesis",
      description: "Products are synthesized in small batches to ensure maximum potency."
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 bg-surface" id="about" data-testid="about-section">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm text-primary uppercase tracking-widest font-semibold">Why Choose Us</span>
          <h2 className="font-heading text-3xl sm:text-4xl text-text-primary mt-3">
            Committed to Research Excellence
          </h2>
          <p className="font-body text-text-secondary max-w-2xl mx-auto mt-4">
            Macrotides is dedicated to providing researchers with the highest quality peptides 
            for their scientific endeavors.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 bg-background border border-primary/10 rounded group hover:border-primary/30 transition-colors"
            >
              <feature.icon 
                size={40} 
                weight="duotone" 
                className="text-primary mb-4 group-hover:scale-110 transition-transform"
              />
              <h3 className="font-heading text-xl text-text-primary mb-2">{feature.title}</h3>
              <p className="font-body text-text-secondary text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-16 border-t border-primary/10"
        >
          {[
            { value: "50+", label: "Peptides Available" },
            { value: "99%+", label: "Purity Guaranteed" },
            { value: "10K+", label: "Orders Shipped" },
            { value: "24/7", label: "Support Available" }
          ].map((stat, index) => (
            <div key={stat.label} className="text-center">
              <span className="text-4xl font-heading text-primary">{stat.value}</span>
              <p className="text-sm text-text-secondary mt-2">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
