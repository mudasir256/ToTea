import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { ScrollLink } from "@/components/ScrollLink";
import { menuItemHasStock } from "@/lib/menuStock";
import { getSupabase } from "@/lib/supabase";
import type {
  MenuCategory,
  MenuItemWithVariants,
  MenuStockAvailability,
} from "@/types/database";

const featuredNames = [
  "Vietnamese Sea Salt Coffee",
  "Mango Sago Coconut Milk",
  "Matcha Latte",
];

type FeaturedItem = MenuItemWithVariants & {
  category_name: string;
};

function menuPriceLabel(item: MenuItemWithVariants) {
  const prices = (item.menu_item_variants ?? [])
    .map((variant) => Number(variant.price))
    .filter((price) => Number.isFinite(price));
  const lowestPrice = prices.length > 0 ? Math.min(...prices) : Number(item.price);
  return `${prices.length > 1 ? "From " : ""}$${lowestPrice.toFixed(2)}`;
}

export const FeaturedProducts = () => {
  const [items, setItems] = useState<FeaturedItem[]>([]);
  const [stock, setStock] = useState<MenuStockAvailability[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadFeatured() {
      const supabase = getSupabase();
      if (!supabase) {
        setLoading(false);
        return;
      }

      const [itemResult, stockResult] = await Promise.all([
        supabase
          .from("menu_items")
          .select("*, menu_item_variants(*)")
          .in("name", featuredNames)
          .eq("is_available", true),
        supabase.rpc("get_public_menu_stock", { p_menu_item_id: null }),
      ]);

      if (cancelled) return;
      if (itemResult.error || stockResult.error) {
        console.error(
          "Unable to load featured menu items",
          itemResult.error ?? stockResult.error,
        );
        setLoading(false);
        return;
      }

      const menuItems = (itemResult.data ?? []) as MenuItemWithVariants[];
      const categoryIds = [...new Set(menuItems.map((item) => item.category_id))];
      const categoryResult =
        categoryIds.length > 0
          ? await supabase
              .from("menu_categories")
              .select("*")
              .in("id", categoryIds)
              .eq("is_active", true)
          : { data: [], error: null };

      if (cancelled) return;
      const categories = (categoryResult.data ?? []) as MenuCategory[];
      const categoryNames = new Map(categories.map((category) => [category.id, category.name]));
      const ordered = menuItems
        .map((item) => ({
          ...item,
          category_name: categoryNames.get(item.category_id) ?? "ToTea menu",
        }))
        .sort((left, right) => featuredNames.indexOf(left.name) - featuredNames.indexOf(right.name));

      setItems(ordered);
      setStock((stockResult.data ?? []) as MenuStockAvailability[]);
      setLoading(false);
    }

    void loadFeatured();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <span className="mb-4 inline-block text-sm uppercase tracking-[0.2em] text-muted-foreground">
              Customer Favorites
            </span>
            <h2 className="heading-lg mb-6">
              Featured <span className="text-gradient">Products</span>
            </h2>
            <p className="body-lg mx-auto max-w-2xl text-muted-foreground">
              Discover our most loved beverages, handcrafted with premium ingredients
              and served with passion.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex min-h-80 items-center justify-center gap-3 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading favorites...</span>
            </div>
          ) : items.length > 0 ? (
            <div className="mb-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {items.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <ScrollLink to={`/product/${encodeURIComponent(product.name)}`}>
                    <article className="relative h-80 overflow-hidden rounded-4xl border border-border bg-card transition-all duration-500 hover:border-accent/30 hover:shadow-elevated">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
                      {!menuItemHasStock(stock, product.id) ? (
                        <span className="absolute right-5 top-5 z-20 rounded-full bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-red-700 shadow-lg">
                          Unavailable
                        </span>
                      ) : null}
                      <div className="absolute inset-x-0 bottom-0 z-10 p-5">
                        <span className="text-xs font-semibold uppercase text-white">
                          {product.category_name}
                        </span>
                        <h3 className="mb-2 mt-2 text-lg font-bold leading-snug text-white transition-colors group-hover:text-accent">
                          {product.name}
                        </h3>
                        <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-white/90">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-base font-bold text-accent">
                            {menuPriceLabel(product)}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs font-medium text-white transition-all group-hover:gap-2 group-hover:text-accent">
                            View Details
                            <ArrowRight size={14} />
                          </span>
                        </div>
                      </div>
                    </article>
                  </ScrollLink>
                </motion.div>
              ))}
            </div>
          ) : null}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <ScrollLink to="/menu" className="btn-outline group inline-flex items-center gap-2">
              <span>View Full Menu</span>
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </ScrollLink>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
