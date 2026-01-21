import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ContactSection = () => {
  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      content: '(703) 555-0100',
      link: 'tel:+17035550100',
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'hello@totea.com',
      link: 'mailto:hello@totea.com',
    },
    {
      icon: MapPin,
      title: 'Location',
      content: 'Northern Virginia',
      link: null,
    },
    {
      icon: Clock,
      title: 'Hours',
      content: 'Mon - Sat: 9:00 AM - 12:00 AM',
      link: null,
    },
  ];

  return (
    <section className="section-padding bg-secondary/30">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="inline-block text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Get in Touch
            </span>
            <h2 className="heading-lg mb-6">
              Contact <span className="text-gradient">Us</span>
            </h2>
            <p className="body-lg text-muted-foreground max-w-2xl mx-auto">
              Have a question or feedback? We'd love to hear from you. Reach out to us
              and we'll respond as soon as possible.
            </p>
          </motion.div>

          {/* Contact Info Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6 rounded-3xl bg-card border border-border hover:border-accent/30 hover:shadow-lg transition-all duration-500 text-center group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                    <Icon size={24} className="text-accent" />
                  </div>
                  <h3 className="font-semibold mb-2">{info.title}</h3>
                  {info.link ? (
                    <a
                      href={info.link}
                      className="text-muted-foreground hover:text-accent transition-colors text-sm"
                    >
                      {info.content}
                    </a>
                  ) : (
                    <p className="text-muted-foreground text-sm">{info.content}</p>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <Link
              to="/contact"
              className="btn-accent inline-flex items-center gap-2"
            >
              <MessageCircle size={18} />
              <span>Send us a Message</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
