import { useParams, useNavigate } from 'react-router-dom';
import { ScrollLink } from '@/components/ScrollLink';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Check } from 'lucide-react';
import { productDetails } from '@/data/productDetails';
import { getMenuImage } from '@/lib/menuImages';
import NotFound from '@/pages/NotFound';

export const ProductDetail = () => {
  const { productName } = useParams<{ productName: string }>();
  const navigate = useNavigate();

  if (!productName) {
    return <NotFound />;
  }

  const decodedName = decodeURIComponent(productName);
  const product = productDetails[decodedName];

  if (!product) {
    return <NotFound />;
  }

  const imageSrc = getMenuImage(product.name);

  return (
    <section className="section-padding pt-24 md:pt-32">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={18} />
              <span>Back to Menu</span>
            </button>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative rounded-4xl overflow-hidden shadow-elevated aspect-square">
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <span className="text-6xl">{product.category === 'Vietnamese Coffee' ? '☕' : 
                      product.category === 'Brown Sugar & Crème Brûlée' ? '🍮' :
                      product.category === 'Classic & Flavored Milk Teas' ? '🧋' :
                      product.category === 'Matcha Collection' ? '🍵' :
                      product.category === 'Fruit & Refreshing Teas' ? '🍑' :
                      product.category === 'Specialty Dessert Drink' ? '🥭' : '🥤'}</span>
                  </div>
                )}
                {product.isHero && (
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-accent/20 backdrop-blur-sm border border-accent/30">
                      <Star size={14} fill="currentColor" className="text-accent" />
                      <span className="text-sm font-semibold text-accent">Hero Item</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Product Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col"
            >
              {/* Category Badge */}
              <div className="mb-4">
                <span className="inline-block px-4 py-2 rounded-full bg-secondary border border-border/50 text-sm font-medium text-muted-foreground">
                  {product.category}
                </span>
              </div>

              {/* Product Name */}
              <h1 className="heading-lg mb-4 text-foreground">
                {product.name}
              </h1>

              {/* Description */}
              <p className="body-lg text-muted-foreground mb-8 leading-relaxed">
                {product.description}
              </p>

              {/* Price & Size */}
              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                {product.price && (
                  <div className="p-6 rounded-3xl bg-secondary border border-border">
                    <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
                      Price
                    </h3>
                    <p className="text-2xl font-bold text-foreground">{product.price}</p>
                  </div>
                )}
                {product.size && (
                  <div className="p-6 rounded-3xl bg-secondary border border-border">
                    <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
                      Sizes Available
                    </h3>
                    <div className="flex gap-2">
                      {product.size.map((size) => (
                        <span
                          key={size}
                          className="px-3 py-1 rounded-full bg-background text-sm font-medium"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Ingredients */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Ingredients</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {product.ingredients.map((ingredient, index) => (
                    <motion.div
                      key={ingredient}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                      className="flex items-center gap-2 text-muted-foreground"
                    >
                      <Check size={16} className="text-accent flex-shrink-0" />
                      <span>{ingredient}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {product.calories && (
                  <div className="p-4 rounded-2xl bg-card border border-border">
                    <p className="text-sm text-muted-foreground mb-1">Calories</p>
                    <p className="font-semibold">{product.calories}</p>
                  </div>
                )}
                {product.allergens && product.allergens.length > 0 && (
                  <div className="p-4 rounded-2xl bg-card border border-border">
                    <p className="text-sm text-muted-foreground mb-1">Allergens</p>
                    <p className="font-semibold text-sm">{product.allergens.join(', ')}</p>
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <ScrollLink
                to="/order"
                className="btn-accent w-full text-center mt-auto"
              >
                Order Now
              </ScrollLink>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
