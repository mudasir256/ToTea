import { motion } from 'framer-motion';
import { Leaf, Heart, Sun, Check } from 'lucide-react';

const promises = [
  {
    icon: Leaf,
    title: 'Premium Ingredients',
    description: 'We only use premium loose leaf teas and fresh, organic ingredients',
  },
  {
    icon: Heart,
    title: 'Made with Love',
    description: 'Every drink is crafted with passion and attention to detail',
  },
  {
    icon: Sun,
    title: 'Fresh Daily',
    description: 'All our baked goods are made fresh in-house daily',
  },
  {
    icon: Check,
    title: 'Perfect Every Time',
    description: "Our promise is to make your drink perfect, every time",
  },
];

interface AboutProps {
  hideHeader?: boolean;
}

export const About = ({ hideHeader = false }: AboutProps) => {
  return (
    <section className="section-padding">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          {!hideHeader && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
            <span className="inline-block text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4">
              About Us
            </span>
            <h2 className="heading-lg mb-6">
              Our Story &amp; <span className="text-gradient">Promise</span>
            </h2>
            <p className="body-lg text-muted-foreground max-w-2xl mx-auto">
              We believe in the integrity of providing our customers with quality,
              whole food, and organic ingredients
            </p>
          </motion.div>
          )}

          {/* Promises Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {promises.map((promise, index) => (
              <motion.div
                key={promise.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-8 rounded-3xl bg-card border border-border hover:border-accent/30 hover:shadow-lg transition-all duration-500 text-center group"
              >
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/10 transition-colors">
                  <promise.icon size={28} className="text-accent" />
                </div>
                <h3 className="text-lg font-serif font-semibold mb-3">
                  {promise.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {promise.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Quality Statement */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="p-10 md:p-14 rounded-4xl bg-secondary relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-accent/5 rounded-full blur-3xl" />

              <div className="relative">
                <h3 className="text-3xl md:text-4xl font-serif font-semibold mb-6">
                  Quality You Can Taste
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  We believe in the integrity of providing our customers with quality,
                  whole food, and organic ingredients to satisfy your taste buds. We only
                  use premium loose leaf teas. Every drink has been perfected over time
                  with the best ingredients and all of our baked goods are made fresh
                  in-house daily.
                </p>
                <p className="text-lg text-foreground font-medium italic">
                  "Our promise is to make your drink perfect, every time. If it isn't,
                  let us know and we'll make it right."
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
