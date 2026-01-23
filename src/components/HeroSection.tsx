import { useRef, useEffect, useState } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import { ProductBottleScroll } from './ProductBottleScroll';
import { ProductTextOverlays } from './ProductTextOverlays';
import { products } from '@/data/products';

export const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerEndScroll, setContainerEndScroll] = useState(0);
  const currentProduct = products[0];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const { scrollY } = useScroll();

  useEffect(() => {
    const updateEndPosition = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const containerTop = window.scrollY + rect.top;
        // Adjust scroll multiplier for mobile (shorter scroll distance)
        const isMobile = window.innerWidth < 768;
        const scrollMultiplier = isMobile ? 3.5 : 4.5;
        setContainerEndScroll(containerTop + window.innerHeight * scrollMultiplier);
      }
    };

    updateEndPosition();
    const interval = setInterval(updateEndPosition, 100);
    window.addEventListener('resize', updateEndPosition);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', updateEndPosition);
    };
  }, []);

  const translateY = useTransform(() => {
    const currentScroll = scrollY.get();
    if (containerEndScroll > 0 && currentScroll > containerEndScroll) {
      const pastEnd = currentScroll - containerEndScroll;
      // Smooth upward movement - slower rate for gradual transition
      // Use easing for smoother motion
      const eased = pastEnd * 0.25;
      return -Math.min(eased, window.innerHeight * 2);
    }
    return 0;
  });

  const opacity = useTransform(() => {
    const currentScroll = scrollY.get();
    if (containerEndScroll > 0 && currentScroll > containerEndScroll) {
      const pastEnd = currentScroll - containerEndScroll;
      // Much longer fade distance for smooth transition
      const fadeDistance = window.innerHeight * 2;
      // Use easing function for smoother fade
      const fadeProgress = Math.min(pastEnd / fadeDistance, 1);
      const eased = fadeProgress * fadeProgress; // Quadratic easing
      return Math.max(0, 1 - eased);
    }
    return 1;
  });

  return (
    <section className="relative m-0 p-0 ">
      <div
        ref={containerRef}
        className="relative w-full md:h-[500vh] h-[400vh] m-0 p-0"
      >
        <motion.div 
          className="sticky top-0 w-full h-screen overflow-hidden bg-black"
          style={{ 
            y: translateY,
            opacity: opacity
          }}
        >
          <div className="absolute inset-0 w-full h-full">
            <ProductBottleScroll
              product={currentProduct}
              containerRef={containerRef}
            />
            <ProductTextOverlays
              product={currentProduct}
              containerRef={containerRef}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
