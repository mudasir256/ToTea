import { motion } from 'framer-motion';
import { Product } from '@/data/products';
import { ShoppingCart, Truck, Shield } from 'lucide-react';

interface BuyNowSectionProps {
  product: Product;
}

export const BuyNowSection = ({ product }: BuyNowSectionProps) => {
  const handleAddToCart = () => {
    // Add to cart logic here
    console.log('Add to cart:', product);
  };

  return (
    <section className="section-padding bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-4xl p-8 md:p-12 shadow-elevated border border-border">
            {/* Price */}
            <div className="text-center mb-12">
              <div className="flex items-baseline justify-center gap-3 mb-4">
                <span className="text-6xl md:text-8xl font-bold text-accent">
                  {product.buyNowSection.price}
                </span>
                <span className="text-xl text-muted-foreground">
                  {product.buyNowSection.unit}
                </span>
              </div>
            </div>

            {/* Processing Params */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {product.buyNowSection.processingParams.map((param, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="px-6 py-3 rounded-full border-2 border-accent text-accent bg-accent/10"
                >
                  <span className="font-semibold">{param}</span>
                </motion.div>
              ))}
            </div>

            {/* Add to Cart Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className="w-full py-6 rounded-full text-white font-bold text-xl mb-8 flex items-center justify-center gap-3 transition-all duration-300 bg-gradient-to-r from-accent to-accent/80 shadow-lg hover:shadow-xl"
            >
              <ShoppingCart size={24} />
              Add to Cart
            </motion.button>

            {/* Delivery & Return Info */}
            <div className="space-y-6 pt-8 border-t border-border">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-accent/20">
                  <Truck size={20} className="text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Delivery</h3>
                  <p className="text-muted-foreground">
                    {product.buyNowSection.deliveryPromise}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-accent/20">
                  <Shield size={20} className="text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Returns</h3>
                  <p className="text-muted-foreground">
                    {product.buyNowSection.returnPolicy}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
