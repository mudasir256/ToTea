import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import { ScrollLink } from '@/components/ScrollLink';
import logo from '@/assets/logo.png';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Menu', href: '/menu' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Order Online', href: '/order' },
];

const socialLinks = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
];

export const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    setEmail('');
    alert('Thank you for subscribing!');
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <ScrollLink to="/" className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl overflow-hidden">
                  <img 
                    src={logo} 
                    alt="Totea Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="font-serif text-xl font-bold">Totea</span>
                  <p className="text-[10px] uppercase tracking-wider text-primary-foreground/60 -mt-0.5">
                    Bubble Tea & More
                  </p>
                </div>
              </ScrollLink>
              <p className="text-sm text-primary-foreground/70 leading-relaxed mb-6">
                Premium Bubble Tea & Coffee in Northern Virginia. Crafted with passion,
                served with love.
              </p>
              {/* Social Links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 rounded-xl bg-primary-foreground/10 flex items-center justify-center hover:bg-accent transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h4 className="font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <ScrollLink
                      to={link.href}
                      className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                    >
                      {link.label}
                    </ScrollLink>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h4 className="font-semibold mb-6">Contact</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Phone size={18} className="text-accent mt-0.5" />
                  <a
                    href="tel:+17035550100"
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    (703) 555-0100
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Mail size={18} className="text-accent mt-0.5" />
                  <a
                    href="mailto:hello@totea.com"
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    hello@totea.com
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-primary-foreground/70">
                    Northern Virginia
                  </span>
                </li>
              </ul>
            </motion.div>

            {/* Newsletter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h4 className="font-semibold mb-6">Stay Updated</h4>
              <p className="text-sm text-primary-foreground/70 mb-4">
                Get updates on new menu items, special offers, and events
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="px-4 py-3 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:border-accent transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="btn-accent !py-3 text-center"
                >
                  Subscribe
                </button>
              </form>
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-primary-foreground/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-primary-foreground/60">
                Copyright © {new Date().getFullYear()} Totea by{' '}
                <a
                  href="https://www.clapit.solutions/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent font-semibold hover:text-accent/80 transition-colors"
                >
                  CLAPIT.SOLUTIONS
                </a>{' '}
                All Rights Reserved.
              </p>
              <div className="flex items-center gap-6">
                <a
                  href="#"
                  className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                >
                  Careers
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
