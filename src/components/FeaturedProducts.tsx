import { motion } from 'framer-motion';
import { Star, ArrowRight } from 'lucide-react';
import { ScrollLink } from '@/components/ScrollLink';
import { getMenuImage } from '@/lib/menuImages';

const featuredProducts = [
  {
    name: 'Vietnamese Sea Salt Coffee',
    category: 'Vietnamese Coffee',
    description: 'A unique twist with signature sea salt cream',
    price: '$25-35',
    isHero: true,
  },
  {
    name: 'Mango Sago Coconut Milk',
    category: 'Specialty Dessert Drink',
    description: 'Tropical treat with fresh mango and sago pearls',
    price: '$32-42',
    isHero: true,
  },
  {
    name: 'Matcha Latte',
    category: 'Matcha Collection',
    description: 'Smooth and creamy premium Japanese matcha',
    price: '$26-34',
    isHero: false,
  },
];

export const FeaturedProducts = () => {
  return (
    <section className="section-padding bg-background">
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
              Customer Favorites
            </span>
            <h2 className="heading-lg mb-6">
              Featured <span className="text-gradient">Products</span>
            </h2>
            <p className="body-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our most loved beverages, handcrafted with premium ingredients
              and served with passion.
            </p>
          </motion.div>

          {/* Featured Products Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProducts.map((product, index) => {
              const imageSrc = getMenuImage(product.name);
              const productUrl = `/product/${encodeURIComponent(product.name)}`;

              return (
                <motion.div
                  key={product.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <ScrollLink to={productUrl}>
                    <div className="relative h-80 rounded-4xl overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 border border-border hover:border-accent/30 transition-all duration-500 hover:shadow-elevated">
                      {/* Product Image */}
                      {imageSrc ? (
                        <div className="absolute inset-0">
                          <img
                            src={imageSrc}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                      )}

                      {/* Hero Badge */}
                      {product.isHero && (
                        <div className="absolute top-4 right-4 z-10">
                          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-accent/20 backdrop-blur-sm border border-accent/30">
                            <Star size={14} fill="currentColor" className="text-accent" />
                            <span className="text-xs font-semibold text-accent">Hero Item</span>
                          </div>
                        </div>
                      )}

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                        <div className="mb-2">
                          <span className="text-xs uppercase tracking-wider text-accent/80 font-medium">
                            {product.category}
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-accent transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-sm text-white/80 mb-4 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-accent">{product.price}</span>
                          <div className="flex items-center gap-2 text-white/80 group-hover:text-accent group-hover:gap-3 transition-all">
                            <span className="text-sm font-medium">View Details</span>
                            <ArrowRight size={16} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollLink>
                </motion.div>
              );
            })}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <ScrollLink
              to="/menu"
              className="btn-outline inline-flex items-center gap-2 group"
            >
              <span>View Full Menu</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </ScrollLink>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
