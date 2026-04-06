import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { CaretDown, Question } from '@phosphor-icons/react';

const faqs = [
  {
    question: "What are your peptides used for?",
    answer: "Our peptides are sold strictly for in-vitro research, laboratory testing, and educational purposes. They are not intended for human or animal consumption, therapeutic use, or any clinical applications."
  },
  {
    question: "How do you ensure purity?",
    answer: "All our peptides undergo rigorous High-Performance Liquid Chromatography (HPLC) testing and Mass Spectrometry verification. Each product achieves a minimum of 99% purity, and we provide Certificates of Analysis (COA) with every order."
  },
  {
    question: "What is your shipping policy?",
    answer: "We offer discrete worldwide shipping. Orders over $100 qualify for free shipping within the continental US. All packages are shipped in unmarked, temperature-controlled packaging to ensure product integrity."
  },
  {
    question: "Do you offer bulk discounts?",
    answer: "Yes, we offer competitive pricing for research institutions and laboratories requiring bulk quantities. Please contact our sales team for custom quotes on large orders."
  },
  {
    question: "How should I store the peptides?",
    answer: "For optimal stability, lyophilized peptides should be stored at -20°C or colder. Once reconstituted, peptides should be stored at 4°C and used within the timeframe specified in the product documentation."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards through our secure payment processor (Stripe). All transactions are encrypted and PCI-compliant to ensure your financial security."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-20 px-4 sm:px-6" id="faq" data-testid="faq-section">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm text-primary uppercase tracking-widest font-semibold">FAQ</span>
          <h2 className="font-heading text-3xl sm:text-4xl text-text-primary mt-3">
            Frequently Asked Questions
          </h2>
        </motion.div>

        {/* FAQ List */}
        <div className="space-y-4" data-testid="faq-list">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="border border-primary/15 rounded overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-surface/50 transition-colors"
                data-testid={`faq-question-${index}`}
              >
                <div className="flex items-center gap-3">
                  <Question size={20} weight="duotone" className="text-primary flex-shrink-0" />
                  <span className="font-body font-medium text-text-primary">{faq.question}</span>
                </div>
                <CaretDown 
                  size={20} 
                  className={`text-primary transition-transform flex-shrink-0 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 pt-0 pl-12 font-body text-text-secondary text-sm leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12 p-8 bg-surface border border-primary/10 rounded"
        >
          <p className="text-text-secondary mb-4">
            Have more questions? We're here to help.
          </p>
          <a
            href="mailto:support@macrotides.com"
            className="text-primary hover:text-primary-hover transition-colors font-semibold"
          >
            Contact Support →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
