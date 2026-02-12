import { useRef, useEffect, useState, useCallback } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import { ProductBottleScroll } from './ProductBottleScroll';
import { ProductTextOverlays } from './ProductTextOverlays';
import { products } from '@/data/products';

const MOBILE_BREAKPOINT = 768;

// Cubic ease-out for smooth, professional exit (0, 0, 0.2, 1)
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerEndScroll, setContainerEndScroll] = useState(0);
  const currentProduct = products[0];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const { scrollY } = useScroll();

  const updateEndPosition = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const containerTop = window.scrollY + rect.top;
    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    // Mobile: slightly shorter scroll for snappier feel, desktop: full parallax
    const scrollMultiplier = isMobile ? 3.2 : 4.5;
    setContainerEndScroll(containerTop + window.innerHeight * scrollMultiplier);
  }, []);

  useEffect(() => {
    updateEndPosition();
    const resizeObserver = new ResizeObserver(() => updateEndPosition());
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateEndPosition();
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateEndPosition);
    window.addEventListener('orientationchange', updateEndPosition);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateEndPosition);
      window.removeEventListener('orientationchange', updateEndPosition);
    };
  }, [updateEndPosition]);

  const translateY = useTransform(() => {
    const currentScroll = scrollY.get();
    if (containerEndScroll <= 0 || currentScroll <= containerEndScroll) return 0;
    const pastEnd = currentScroll - containerEndScroll;
    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    // Mobile: gentler movement and smaller max travel for smoother feel
    const rate = isMobile ? 0.18 : 0.25;
    const maxTravel = isMobile ? window.innerHeight * 1.2 : window.innerHeight * 2;
    const linear = Math.min(pastEnd * rate, maxTravel);
    const progress = linear / maxTravel;
    return -maxTravel * easeOutCubic(progress);
  });

  const opacity = useTransform(() => {
    const currentScroll = scrollY.get();
    if (containerEndScroll <= 0 || currentScroll <= containerEndScroll) return 1;
    const pastEnd = currentScroll - containerEndScroll;
    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    // Mobile: longer fade distance for smoother transition
    const fadeDistance = isMobile ? window.innerHeight * 1.8 : window.innerHeight * 2;
    const fadeProgress = Math.min(pastEnd / fadeDistance, 1);
    const eased = easeOutCubic(fadeProgress);
    return Math.max(0, 1 - eased);
  });

  return (
    <section className="relative m-0 p-0 touch-pan-y">
      <div
        ref={containerRef}
        className="relative w-full md:h-[500vh] h-[400vh] m-0 p-0"
      >
        <motion.div
          className="sticky top-0 w-full h-screen overflow-hidden bg-black"
          style={{
            y: translateY,
            opacity,
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
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
