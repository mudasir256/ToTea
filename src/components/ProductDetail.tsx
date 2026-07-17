import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Loader2, ShoppingCart, Star } from "lucide-react";
import { productDetails } from "@/data/productDetails";
import { getCatalogProductByName } from "@/data/catalog";
import { getMenuImage } from "@/lib/menuImages";
import { formatMoney } from "@/lib/money";
import { useCart, resolveLocalVariant } from "@/features/cart/CartProvider";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import NotFound from "@/pages/NotFound";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const ProductDetail = () => {
  const { productName } = useParams<{ productName: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>("Regular");
  const [adding, setAdding] = useState(false);

  const decodedName = productName ? decodeURIComponent(productName) : "";
  const product = decodedName ? productDetails[decodedName] : undefined;
  const catalog = product ? getCatalogProductByName(product.name) : undefined;
  const sizes = product?.size?.length ? product.size : ["Regular", "Large"];
  const imageSrc = product ? getMenuImage(product.name) : undefined;

  const priceLabel = useMemo(() => {
    if (!product) return undefined;
    if (!catalog) return product.price;
    const variant = catalog.variants.find((v) => v.sizeLabel === selectedSize) || catalog.variants[0];
    if (variant) return formatMoney(variant.unitPriceCents);
    const low = catalog.variants[0]?.unitPriceCents ?? 0;
    const high = catalog.variants[catalog.variants.length - 1]?.unitPriceCents ?? low;
    return `${formatMoney(low)} – ${formatMoney(high)}`;
  }, [catalog, product, selectedSize]);

  if (!productName || !product) {
    return <NotFound />;
  }

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      if (isSupabaseConfigured) {
        const supabase = getSupabase();
        if (supabase) {
          const { data: dbProduct } = await supabase
            .from("products")
            .select("id, name, image_url, product_variants(id, size_label, unit_price_cents, stock_quantity, is_active)")
            .eq("name", product.name)
            .maybeSingle();

          const variants = (dbProduct?.product_variants || []) as Array<{
            id: string;
            size_label: string;
            unit_price_cents: number;
            stock_quantity: number;
            is_active: boolean;
          }>;
          const variant = variants.find((v) => v.size_label === selectedSize && v.is_active);
          if (dbProduct && variant) {
            if (variant.stock_quantity < 1) {
              toast.error("This size is out of stock");
              return;
            }
            await addItem({
              product_id: dbProduct.id as string,
              product_variant_id: variant.id,
              product_name: dbProduct.name as string,
              product_image: (dbProduct.image_url as string | null) || imageSrc || null,
              selected_options: { size: selectedSize },
              unit_price_cents: variant.unit_price_cents,
              stock_quantity: variant.stock_quantity,
              quantity: 1,
            });
            return;
          }
        }
      }

      const local = resolveLocalVariant(product.name, selectedSize);
      if (!local) {
        toast.error("Unable to add this product variant");
        return;
      }
      await addItem({ ...local, quantity: 1 });
    } finally {
      setAdding(false);
    }
  };

  return (
    <section className="section-padding pt-24 md:pt-32">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="max-w-5xl mx-auto">
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
                    <span className="text-6xl">🧋</span>
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

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col"
            >
              <div className="mb-4">
                <span className="inline-block px-4 py-2 rounded-full bg-secondary border border-border/50 text-sm font-medium text-muted-foreground">
                  {product.category}
                </span>
              </div>

              <h1 className="heading-lg mb-4 text-foreground">{product.name}</h1>
              <p className="body-lg text-muted-foreground mb-8 leading-relaxed">{product.description}</p>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="p-6 rounded-3xl bg-secondary border border-border">
                  <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">Price</h3>
                  <p className="text-2xl font-bold text-foreground">{priceLabel}</p>
                </div>
                <div className="p-6 rounded-3xl bg-secondary border border-border">
                  <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
                    Choose size
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                          selectedSize === size
                            ? "bg-accent text-accent-foreground border-accent"
                            : "bg-background border-border"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

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
                    <p className="font-semibold text-sm">{product.allergens.join(", ")}</p>
                  </div>
                )}
              </div>

              <div className="mt-auto flex flex-col sm:flex-row gap-3">
                <Button
                  type="button"
                  className="btn-accent flex-1 h-12"
                  disabled={adding}
                  onClick={() => void handleAddToCart()}
                >
                  {adding ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ShoppingCart className="mr-2 h-4 w-4" />
                  )}
                  Add to cart
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-12 rounded-full"
                  onClick={() => navigate("/cart")}
                >
                  View cart
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
