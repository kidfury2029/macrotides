import { Flask, EnvelopeSimple, MapPin, Phone } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer py-16 px-4 sm:px-6" data-testid="footer">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Flask size={24} weight="duotone" className="text-primary" />
              <span className="font-heading text-xl text-text-primary">
                Macro<span className="text-primary">tides</span>
              </span>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed">
              Premium research peptides for scientific discovery. All products are for 
              research purposes only.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg text-text-primary mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Products', 'Categories', 'About', 'FAQ'].map((link) => (
                <li key={link}>
                  <a 
                    href={`#${link.toLowerCase()}`}
                    className="text-sm text-text-secondary hover:text-primary transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-heading text-lg text-text-primary mb-4">Categories</h4>
            <ul className="space-y-2">
              {['Healing & Recovery', 'Growth Hormone', 'Cognitive', 'Metabolism', 'Research'].map((cat) => (
                <li key={cat}>
                  <span className="text-sm text-text-secondary">{cat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-lg text-text-primary mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-text-secondary">
                <EnvelopeSimple size={18} className="text-primary" />
                support@macrotides.com
              </li>
              <li className="flex items-center gap-3 text-sm text-text-secondary">
                <Phone size={18} className="text-primary" />
                1-800-PEPTIDE
              </li>
              <li className="flex items-start gap-3 text-sm text-text-secondary">
                <MapPin size={18} className="text-primary flex-shrink-0 mt-0.5" />
                <span>Research District<br />Science City, SC 12345</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-text-secondary text-center md:text-left">
              © {new Date().getFullYear()} Macrotides. All rights reserved. Products are sold for 
              research purposes only and are not intended for human consumption.
            </p>
            <div className="flex gap-6 text-xs text-text-secondary">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Refund Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
