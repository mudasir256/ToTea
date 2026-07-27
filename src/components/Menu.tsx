import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { ScrollLink } from "@/components/ScrollLink";
import { getSupabase } from "@/lib/supabase";
import { menuItemHasStock } from "@/lib/menuStock";
import type { MenuCategory, MenuItemWithVariants, MenuStockAvailability, MenuTopping } from "@/types/database";

interface MenuProps {
  hideHeader?: boolean;
}

type MenuCategoryWithItems = MenuCategory & {
  items: MenuItemWithVariants[];
};

function menuPriceLabel(item: MenuItemWithVariants) {
  const prices = (item.menu_item_variants ?? [])
    .map((variant) => Number(variant.price))
    .filter((price) => Number.isFinite(price));
  const lowestPrice = prices.length > 0 ? Math.min(...prices) : Number(item.price);
  return `${prices.length > 1 ? "From " : ""}$${lowestPrice.toFixed(2)}`;
}

export const Menu = ({ hideHeader = false }: MenuProps) => {
  const [categories, setCategories] = useState<MenuCategoryWithItems[]>([]);
  const [toppings, setToppings] = useState<MenuTopping[]>([]);
  const [stock, setStock] = useState<MenuStockAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadMenu() {
      const supabase = getSupabase();
      if (!supabase) {
        setError("The menu is temporarily unavailable.");
        setLoading(false);
        return;
      }

      const [categoryResult, itemResult, toppingResult, stockResult] = await Promise.all([
        supabase
          .from("menu_categories")
          .select("*")
          .eq("is_active", true)
          .order("sort_order", { ascending: true }),
        supabase
          .from("menu_items")
          .select("*, menu_item_variants(*)")
          .eq("is_available", true)
          .order("sort_order", { ascending: true }),
        supabase
          .from("menu_toppings")
          .select("*")
          .eq("is_available", true)
          .order("sort_order", { ascending: true }),
        supabase.rpc("get_public_menu_stock", {
          p_menu_item_id: null,
        }),
      ]);

      if (cancelled) return;
      if (
        categoryResult.error || itemResult.error ||
        toppingResult.error || stockResult.error
      ) {
        console.error(
          categoryResult.error ?? itemResult.error ?? toppingResult.error ?? stockResult.error,
        );
        setError("We could not load the menu. Please try again.");
        setLoading(false);
        return;
      }

      const items = (itemResult.data ?? []) as MenuItemWithVariants[];
      const grouped = ((categoryResult.data ?? []) as MenuCategory[])
        .map((category) => ({
          ...category,
          items: items.filter((item) => item.category_id === category.id),
        }))
        .filter((category) => category.items.length > 0);

      setCategories(grouped);
      setToppings((toppingResult.data ?? []) as MenuTopping[]);
      setStock((stockResult.data ?? []) as MenuStockAvailability[]);
      setLoading(false);
    }

    void loadMenu();
    return () => {
      cancelled = true;
    };
  }, []);

  const itemOffsets = useMemo(() => {
    let offset = 0;
    return categories.map((category) => {
      const current = offset;
      offset += category.items.length;
      return current;
    });
  }, [categories]);

  return (
    <section className="section-padding">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          {!hideHeader ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16 text-center"
            >
              <span className="mb-4 inline-block text-sm uppercase tracking-[0.2em] text-muted-foreground">
                Our Menu
              </span>
              <h2 className="heading-lg mb-6">
                Crafted with <span className="text-gradient">Passion</span>
              </h2>
              <p className="body-lg mx-auto max-w-2xl text-muted-foreground">
                From traditional Vietnamese coffee to refreshing fruit teas, discover
                our carefully curated selection of handcrafted beverages.
              </p>
            </motion.div>
          ) : null}

          {loading ? (
            <div className="flex min-h-72 items-center justify-center gap-3 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading the menu...</span>
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-destructive/20 bg-destructive/5 px-6 py-12 text-center text-destructive">
              {error}
            </div>
          ) : categories.length === 0 ? (
            <div className="rounded-3xl border border-border bg-card px-6 py-12 text-center text-muted-foreground">
              New menu items are coming soon.
            </div>
          ) : (
            <div className="mb-16 space-y-16">
              {categories.map((category, categoryIndex) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
                      {category.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {category.items.length} {category.items.length === 1 ? "item" : "items"}
                    </p>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                      {category.description}
                    </p>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {category.items.map((item, itemIndex) => (
                      <ScrollLink
                        key={item.id}
                        to={`/product/${encodeURIComponent(item.name)}`}
                      >
                        <motion.article
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.5,
                            delay: (itemOffsets[categoryIndex] + itemIndex) * 0.03,
                          }}
                          className="group relative h-72 cursor-pointer overflow-hidden rounded-3xl border border-border bg-card"
                        >
                          {!menuItemHasStock(stock, item.id) ? (
                            <span className="absolute left-4 top-4 z-20 rounded-full border border-white/30 bg-white/95 px-3 py-1.5 text-xs font-semibold text-gray-900 shadow-lg backdrop-blur-sm">
                              Unavailable
                            </span>
                          ) : null}
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                          <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur-sm">
                            <div className="flex items-start justify-between gap-3">
                              <h4 className="text-sm font-semibold leading-tight text-gray-900 md:text-base">
                                {item.name}
                              </h4>
                              <span className="shrink-0 text-sm font-bold text-amber-700">
                                {menuPriceLabel(item)}
                              </span>
                            </div>
                          </div>
                        </motion.article>
                      </ScrollLink>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && !error && toppings.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-16 rounded-4xl bg-secondary p-8 md:p-12"
            >
              <h3 className="mb-8 text-center font-serif text-2xl font-semibold">
                Toppings
              </h3>
              <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2">
                {[
                  { title: "Standard Toppings", category: "standard" as const },
                  { title: "Cream Toppings (Upsell)", category: "cream" as const },
                ].map((group) => {
                  const groupToppings = toppings.filter(
                    (topping) => topping.category === group.category,
                  );
                  if (groupToppings.length === 0) return null;

                  return (
                    <div key={group.category}>
                      <h4 className="mb-6 text-sm uppercase tracking-wider text-muted-foreground">
                        {group.title}
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        {groupToppings.map((topping, index) => (
                          <motion.div
                            key={topping.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative h-32 overflow-hidden rounded-2xl"
                          >
                            <img
                              src={topping.image_url}
                              alt={topping.name}
                              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                            <div className="absolute inset-x-2 bottom-2 rounded-xl bg-white/95 px-3 py-2 shadow-lg">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-semibold leading-tight text-gray-900">
                                  {topping.name}
                                </span>
                                {Number(topping.price) > 0 ? (
                                  <span className="shrink-0 text-xs font-bold text-amber-700">
                                    ${Number(topping.price).toFixed(2)}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ) : null}
        </div>
      </div>
    </section>
  );
};
