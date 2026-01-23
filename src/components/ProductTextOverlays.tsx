import { useScroll, useTransform, motion } from 'framer-motion';
import { Product } from '@/data/products';

interface ProductTextOverlaysProps {
  product: Product;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const ProductTextOverlays = ({ product, containerRef }: ProductTextOverlaysProps) => {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Section 1: Visible immediately, fade out at 0.2-0.3
  const section1Opacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.2, 0.3],
    [1, 1, 1, 0]
  );
  const section1Y = useTransform(
    scrollYProgress,
    [0, 0.1, 0.2, 0.3],
    [0, 0, 0, -30]
  );

  // Section 2: Fade in at 0.25-0.4, fade out at 0.4-0.5
  const section2Opacity = useTransform(
    scrollYProgress,
    [0.25, 0.35, 0.45, 0.55],
    [0, 1, 1, 0]
  );
  const section2Y = useTransform(
    scrollYProgress,
    [0.25, 0.35, 0.45, 0.55],
    [30, 0, 0, -30]
  );

  // Section 3: Fade in at 0.5-0.65, fade out at 0.65-0.75
  const section3Opacity = useTransform(
    scrollYProgress,
    [0.5, 0.6, 0.7, 0.8],
    [0, 1, 1, 0]
  );
  const section3Y = useTransform(
    scrollYProgress,
    [0.5, 0.6, 0.7, 0.8],
    [30, 0, 0, -30]
  );

  // Section 4: Fade in at 0.75-0.9, stay visible
  const section4Opacity = useTransform(
    scrollYProgress,
    [0.75, 0.85, 1],
    [0, 1, 1]
  );
  const section4Y = useTransform(
    scrollYProgress,
    [0.75, 0.85, 1],
    [30, 0, 0]
  );

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
