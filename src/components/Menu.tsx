import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { menuCategories, toppings } from '@/data/menu';
import { getMenuImage, getToppingImage } from '@/lib/menuImages';

interface MenuProps {
  hideHeader?: boolean;
}

export const Menu = ({ hideHeader = false }: MenuProps) => {
  return (
    <section className="section-padding">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          {!hideHeader && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
            <span className="inline-block text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Our Menu
            </span>
            <h2 className="heading-lg mb-6">
              Crafted with <span className="text-gradient">Passion</span>
            </h2>
            <p className="body-lg text-muted-foreground max-w-2xl mx-auto">
              From traditional Vietnamese coffee to refreshing fruit teas, discover
              our carefully curated selection of handcrafted beverages.
            </p>
          </motion.div>
          )}

          {/* Menu Categories */}
          <div className="space-y-16 mb-16">
            {menuCategories.map((category, categoryIndex) => {
              let itemIndex = 0;
              // Calculate starting index for animation delay
              for (let i = 0; i < categoryIndex; i++) {
                itemIndex += menuCategories[i].items.length;
              }

              return (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6"
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{category.icon}</span>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-serif font-semibold text-foreground">
                        {category.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        ({category.items.length} {category.items.length === 1 ? 'item' : 'items'})
                      </p>
                    </div>
                  </div>

                  {/* Category Items Grid */}
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {category.items.map((item, itemIndexInCategory) => {
                      const imageSrc = getMenuImage(item.name);
                      const globalIndex = itemIndex + itemIndexInCategory;
                      
                      const productUrl = `/product/${encodeURIComponent(item.name)}`;
                      
                      return (
                        <Link to={productUrl}>
                          <motion.div
                            key={item.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: globalIndex * 0.05 }}
                            className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer"
                          >
                          {/* Background Image Container */}
                          <div className="absolute inset-0">
                            {imageSrc ? (
                              <>
                                {/* Clear Image (Default) */}
                                <div
                                  className="absolute inset-0 bg-cover bg-center transition-all duration-500 group-hover:opacity-0"
                                  style={{ backgroundImage: `url(${imageSrc})` }}
                                />
                                {/* Blurred Image (On Hover) */}
                                <div
                                  className="absolute inset-0 bg-cover bg-center transition-all duration-500 opacity-0 group-hover:opacity-100 blur-md scale-110"
                                  style={{ backgroundImage: `url(${imageSrc})` }}
                                />
                              </>
                            ) : (
                              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                            )}
                          </div>
                          
                          {/* Name Card - Animates from Bottom to Center (Vertical Only) */}
                          <div className="absolute bottom-4 left-4 right-4 transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:-translate-y-[5.5rem]">
                            <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg">
                              <div className="flex items-center justify-between gap-2">
                                <h3 className="font-semibold text-gray-900 text-sm md:text-base leading-tight">
                                  {item.name}
                                </h3>
                                {item.isHero && (
                                  <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium flex-shrink-0">
                                    <Star size={12} fill="currentColor" />
                                    Hero
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Toppings Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 p-8 md:p-12 rounded-4xl bg-secondary"
          >
            <h3 className="text-2xl font-serif font-semibold text-center mb-8">
              Toppings
            </h3>
            <div className="grid sm:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Standard Toppings */}
              <div>
                <h4 className="text-sm uppercase tracking-wider text-muted-foreground mb-6">
                  Standard Toppings
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {toppings
                    .filter((t) => t.category === 'standard')
                    .map((topping, index) => {
                      const imageSrc = getToppingImage(topping.name);
                      return (
                        <motion.div
                          key={topping.name}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="group relative h-32 rounded-2xl overflow-hidden cursor-pointer"
                        >
                          {/* Background Image */}
                          {imageSrc ? (
                            <>
                              <div
                                className="absolute inset-0 bg-cover bg-center transition-all duration-500 group-hover:opacity-0"
                                style={{ backgroundImage: `url(${imageSrc})` }}
                              />
                              <div
                                className="absolute inset-0 bg-cover bg-center transition-all duration-500 opacity-0 group-hover:opacity-100 blur-md scale-110"
                                style={{ backgroundImage: `url(${imageSrc})` }}
                              />
                            </>
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                          )}
                          
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          
                          {/* Name at Bottom */}
                          <div className="absolute bottom-2 left-2 right-2 transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:-translate-y-[3rem]">
                            <div className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg">
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-semibold text-gray-900 text-xs leading-tight">
                                  {topping.name}
                                </span>
                                {topping.isHero && (
                                  <Star size={10} fill="currentColor" className="text-accent flex-shrink-0" />
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                </div>
              </div>

              {/* Cream Toppings */}
              <div>
                <h4 className="text-sm uppercase tracking-wider text-muted-foreground mb-6">
                  Cream Toppings (Upsell)
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {toppings
                    .filter((t) => t.category === 'cream')
                    .map((topping, index) => {
                      const imageSrc = getToppingImage(topping.name);
                      return (
                        <motion.div
                          key={topping.name}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="group relative h-32 rounded-2xl overflow-hidden cursor-pointer"
                        >
                          {/* Background Image */}
                          {imageSrc ? (
                            <>
                              <div
                                className="absolute inset-0 bg-cover bg-center transition-all duration-500 group-hover:opacity-0"
                                style={{ backgroundImage: `url(${imageSrc})` }}
                              />
                              <div
                                className="absolute inset-0 bg-cover bg-center transition-all duration-500 opacity-0 group-hover:opacity-100 blur-md scale-110"
                                style={{ backgroundImage: `url(${imageSrc})` }}
                              />
                            </>
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                          )}
                          
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          
                          {/* Name at Bottom */}
                          <div className="absolute bottom-2 left-2 right-2 transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:-translate-y-[3rem]">
                            <div className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg">
                              <span className="font-semibold text-gray-900 text-xs leading-tight">
                                {topping.name}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
