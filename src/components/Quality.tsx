import { motion } from 'framer-motion';
import { Award, Leaf, Coffee, Heart, Sparkles, CheckCircle2 } from 'lucide-react';

const qualityFeatures = [
  {
    icon: Leaf,
    title: 'Fresh Ingredients',
    description: 'We source only the finest, freshest ingredients daily to ensure every drink is perfect.',
  },
  {
    icon: Coffee,
    title: 'Premium Quality',
    description: 'Hand-selected premium teas and coffee beans for the ultimate flavor experience.',
  },
  {
    icon: Heart,
    title: 'Made with Love',
    description: 'Every beverage is crafted with passion and attention to detail by our expert baristas.',
  },
  {
    icon: Award,
    title: 'Award-Winning',
    description: 'Recognized for excellence in taste, quality, and customer satisfaction.',
  },
  {
    icon: Sparkles,
    title: 'Innovation',
    description: 'Constantly innovating with new flavors while maintaining our commitment to quality.',
  },
  {
    icon: CheckCircle2,
    title: 'Consistency',
    description: 'Every visit guarantees the same exceptional quality you know and love.',
  },
];

export const Quality = () => {
  return (
    <section className="section-padding bg-secondary/30">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Our Commitment
            </span>
            <h2 className="heading-lg mb-6">
              We Provide <span className="text-gradient">Best Quality</span>
            </h2>
            <p className="body-lg text-muted-foreground max-w-2xl mx-auto">
              At Totea, quality isn't just a promise—it's our foundation. Every ingredient,
              every recipe, and every cup is crafted to perfection.
            </p>
          </motion.div>

          {/* Quality Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {qualityFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="h-full p-8 rounded-3xl bg-card border border-border hover:border-accent/30 transition-all duration-500 hover:shadow-elevated hover:-translate-y-1">
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                      <Icon className="w-8 h-8 text-accent" />
                    </div>

                    {/* Content */}
                    <h3 className="heading-md mb-4 text-foreground group-hover:text-accent transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Quality Promise Banner */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="relative rounded-4xl overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90 p-12 md:p-16 text-center"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, hsl(var(--accent)) 1px, transparent 1px),
                    linear-gradient(to bottom, hsl(var(--accent)) 1px, transparent 1px)
                  `,
                  backgroundSize: '40px 40px',
                }}
              />
            </div>

            {/* Content */}
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/20 mb-6"
              >
                <Award className="w-10 h-10 text-accent" />
              </motion.div>
              <h3 className="heading-md text-white mb-4">
                Quality Guaranteed, Every Time
              </h3>
              <p className="body-lg text-white/90 max-w-2xl mx-auto">
                From the moment you walk in to your last sip, we ensure every aspect
                of your experience meets our highest standards. That's the Totea promise.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
