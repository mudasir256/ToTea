import { motion } from 'framer-motion';
import { Product } from '@/data/products';
import { Check } from 'lucide-react';

interface ProductDetailsProps {
  product: Product;
}

export const ProductDetails = ({ product }: ProductDetailsProps) => {
  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          {/* Details Section */}
          <div className="mb-24">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 text-foreground">
              {product.detailsSection.title}
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-4xl">
              {product.detailsSection.description}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-24">
            {product.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-8 rounded-3xl border border-border bg-card"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-accent/20">
                    <Check
                      size={20}
                      className="text-accent"
                    />
                  </div>
                  <h3 className="text-xl font-semibold">{feature}</h3>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-8 mb-24">
            {product.stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-8 rounded-3xl bg-accent/10"
              >
                <div className="text-5xl md:text-6xl font-bold mb-2 text-accent">
                  {stat.val}
                </div>
                <div className="text-lg text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Freshness Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="p-12 md:p-16 rounded-4xl bg-gradient-to-br from-gray-900 to-gray-800 text-white"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              {product.freshnessSection.title}
            </h2>
            <p className="text-xl md:text-2xl leading-relaxed opacity-95">
              {product.freshnessSection.description}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
