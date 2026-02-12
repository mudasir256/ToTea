import { useScroll, useTransform, motion } from 'framer-motion';
import { Product } from '@/data/products';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProductTextOverlaysProps {
  product: Product;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const ProductTextOverlays = ({ product, containerRef }: ProductTextOverlaysProps) => {
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Mobile: wider progress ranges so each section stays visible longer and transitions feel smoother
  const s1 = isMobile ? [0, 0.12, 0.28, 0.38] : [0, 0.1, 0.2, 0.3];
  const s2 = isMobile ? [0.3, 0.42, 0.52, 0.62] : [0.25, 0.35, 0.45, 0.55];
  const s3 = isMobile ? [0.55, 0.68, 0.78, 0.88] : [0.5, 0.6, 0.7, 0.8];
  const s4 = isMobile ? [0.82, 0.92, 1] : [0.75, 0.85, 1];

  // Section 1: Visible immediately, fade out
  const section1Opacity = useTransform(scrollYProgress, s1, [1, 1, 1, 0]);
  const section1Y = useTransform(scrollYProgress, s1, [0, 0, 0, -24]);

  // Section 2
  const section2Opacity = useTransform(scrollYProgress, s2, [0, 1, 1, 0]);
  const section2Y = useTransform(scrollYProgress, s2, [24, 0, 0, -24]);

  // Section 3
  const section3Opacity = useTransform(scrollYProgress, s3, [0, 1, 1, 0]);
  const section3Y = useTransform(scrollYProgress, s3, [24, 0, 0, -24]);

  // Section 4: Fade in, stay visible
  const section4Opacity = useTransform(scrollYProgress, s4, [0, 1, 1]);
  const section4Y = useTransform(scrollYProgress, s4, [24, 0, 0]);

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Section 1 */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ opacity: section1Opacity, y: section1Y }}
      >
        <div className="text-center px-4 sm:px-6 max-w-5xl">
          <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-[8rem] font-bold text-white mb-2 sm:mb-4 drop-shadow-2xl leading-tight sm:leading-normal">
            {product.section1.title}
          </h1>
          <p className="text-sm sm:text-lg md:text-2xl text-white/90 drop-shadow-lg px-2">
            {product.section1.subtitle}
          </p>
        </div>
      </motion.div>

      {/* Section 2 */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ opacity: section2Opacity, y: section2Y }}
      >
        <div className="text-center px-4 sm:px-6 max-w-5xl">
          <h2 className="text-2xl sm:text-4xl md:text-6xl lg:text-[7rem] font-bold text-white mb-3 sm:mb-6 drop-shadow-2xl leading-tight sm:leading-normal">
            {product.section2.title}
          </h2>
          <p className="text-xs sm:text-base md:text-xl text-white/90 drop-shadow-lg max-w-3xl mx-auto px-2">
            {product.section2.subtitle}
          </p>
        </div>
      </motion.div>

      {/* Section 3 */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ opacity: section3Opacity, y: section3Y }}
      >
        <div className="text-center px-4 sm:px-6 max-w-5xl">
          <h2 className="text-2xl sm:text-4xl md:text-6xl lg:text-[7rem] font-bold text-white mb-3 sm:mb-6 drop-shadow-2xl leading-tight sm:leading-normal">
            {product.section3.title}
          </h2>
          <p className="text-xs sm:text-base md:text-xl text-white/90 drop-shadow-lg max-w-3xl mx-auto px-2">
            {product.section3.subtitle}
          </p>
        </div>
      </motion.div>

      {/* Section 4 */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ opacity: section4Opacity, y: section4Y }}
      >
        <div className="text-center px-4 sm:px-6 max-w-5xl">
          <h2 className="text-2xl sm:text-4xl md:text-6xl lg:text-[7rem] font-bold text-white mb-3 sm:mb-6 drop-shadow-2xl leading-tight sm:leading-normal">
            {product.section4.title}
          </h2>
          {product.section4.subtitle && (
            <p className="text-xs sm:text-base md:text-xl text-white/90 drop-shadow-lg max-w-3xl mx-auto px-2">
              {product.section4.subtitle}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};
