import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NanoNavbar } from '@/components/NanoNavbar';
import { HeroSection } from '@/components/HeroSection';
import { ProductDetails } from '@/components/ProductDetails';
import { BuyNowSection } from '@/components/BuyNowSection';
import { NextFlavorButton } from '@/components/NextFlavorButton';
import { products } from '@/data/products';

const NanoBananaPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentProduct = products[currentIndex];

  // Reset scroll when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [currentIndex]);

  const nextProduct = () => {
    if (currentIndex < products.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToProduct = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="min-h-screen">
      <NanoNavbar />
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProduct.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Hero Scrollytelling Section */}
            <HeroSection />

            {/* Product Details Section */}
            <ProductDetails product={currentProduct} />

            {/* Buy Now Section */}
            <BuyNowSection product={currentProduct} />

            {/* Next Flavor Button (only show if not last product) */}
            {currentIndex < products.length - 1 && (
              <NextFlavorButton
                onClick={nextProduct}
                productName={products[currentIndex + 1].name}
                themeColor={products[currentIndex + 1].themeColor}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default NanoBananaPage;
