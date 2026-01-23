import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface NextFlavorButtonProps {
  onClick: () => void;
  productName: string;
  themeColor: string;
}

export const NextFlavorButton = ({ onClick, productName, themeColor }: NextFlavorButtonProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className="section-padding bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.button
            whileHover={{ scale: 1.05, x: 10 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="group relative w-full md:w-auto px-12 py-6 rounded-full text-white font-bold text-xl md:text-2xl overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${themeColor} 0%, ${themeColor}dd 100%)`,
              boxShadow: `0 10px 40px ${themeColor}40`,
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-4">
              Discover {productName}
              <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
            </span>
            <motion.div
              className="absolute inset-0 bg-white/20"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
