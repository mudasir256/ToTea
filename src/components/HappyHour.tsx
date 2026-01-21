import { motion } from 'framer-motion';
import { Clock, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const includedItems = ['Specialteas', 'Milk Teas', 'Cold Brews', 'Vietnamese Coffee'];

export const HappyHour = () => {
  return (
    <section className="section-padding bg-primary text-primary-foreground overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 mb-6">
                <Sparkles size={16} className="text-accent" />
                <span className="text-sm font-medium">Special Offer</span>
              </div>

              <h2 className="heading-lg mb-6">
                Late Night<br />
                <span className="text-gradient">Happy Hour</span>
              </h2>

              <p className="body-lg text-primary-foreground/80 mb-8">
                Every night from 9 PM - 1 AM, enjoy{' '}
                <span className="text-accent font-semibold">$4 regular sized drinks</span>{' '}
                including our most popular selections!
              </p>

              {/* Time Badge */}
              <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-primary-foreground/10 mb-8">
                <Clock size={24} className="text-accent" />
                <div>
                  <div className="text-xl font-bold">9:00 PM - 1:00 AM</div>
                  <div className="text-sm text-primary-foreground/60">Daily</div>
                </div>
              </div>

              <Link to="/order" className="btn-accent inline-block">
                Order Now
              </Link>
            </motion.div>

            {/* Included Items */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-primary-foreground/5 rounded-4xl p-8 md:p-10 border border-primary-foreground/10">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <span className="text-accent">✦</span> What's Included
                </h3>
                <div className="space-y-4">
                  {includedItems.map((item, index) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-primary-foreground/5 hover:bg-primary-foreground/10 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                        <span className="text-accent text-lg">🧋</span>
                      </div>
                      <span className="font-medium text-lg">{item}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-primary-foreground/10">
                  <p className="text-sm text-primary-foreground/60 flex items-center gap-2">
                    <span className="text-accent">★</span>
                    Most locations open until midnight or later!
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
