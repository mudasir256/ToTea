import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

const orderPlatforms = [
  {
    name: 'Toast Pick-Up',
    description: 'Order ahead for quick pick-up',
    color: 'bg-orange-500',
    icon: '🍞',
  },
  {
    name: 'Uber Eats',
    description: 'Delivery or pick-up available',
    color: 'bg-green-600',
    icon: '🚗',
  },
  {
    name: 'DoorDash',
    description: 'Fast delivery to your door',
    color: 'bg-red-500',
    icon: '🚀',
  },
];

interface OrderOnlineProps {
  hideHeader?: boolean;
}

export const OrderOnline = ({ hideHeader = false }: OrderOnlineProps) => {
  return (
    <section className="section-padding bg-primary text-primary-foreground">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          {!hideHeader && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
            <span className="inline-block text-sm uppercase tracking-[0.2em] text-primary-foreground/60 mb-4">
              Convenience
            </span>
            <h2 className="heading-lg mb-6">
              Order <span className="text-gradient">Online</span>
            </h2>
            <p className="body-lg text-primary-foreground/80 max-w-xl mx-auto">
              Skip the line and order ahead for pick-up or delivery
            </p>
          </motion.div>
          )}

          {/* Order Platforms */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {orderPlatforms.map((platform, index) => (
              <motion.a
                key={platform.name}
                href="#"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group p-8 rounded-3xl bg-primary-foreground/5 border border-primary-foreground/10 hover:bg-primary-foreground/10 hover:border-primary-foreground/20 transition-all duration-500"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl ${platform.color} flex items-center justify-center text-2xl`}
                  >
                    {platform.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{platform.name}</h3>
                </div>
                <p className="text-primary-foreground/70 mb-4">{platform.description}</p>
                <span className="inline-flex items-center gap-2 text-accent font-medium group-hover:gap-3 transition-all">
                  Order Now
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
              </motion.a>
            ))}
          </div>

          {/* Tip Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 p-5 rounded-2xl bg-accent/20 text-center"
          >
            <Lightbulb size={20} className="text-accent flex-shrink-0" />
            <p className="text-sm md:text-base">
              <span className="font-semibold">💡 Tip:</span> Order through Uber Eats for
              special promotions and BOGO deals!
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
