import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Plus, Search } from "lucide-react";
import { DrinkCustomizeModal } from "@/features/menu/components/DrinkCustomizeModal";
import { addDefaultToCart } from "@/features/menu/useDrinkCustomization";
import { badgeFor, chipsFor } from "@/features/menu/badges";
import { useCart } from "@/features/cart/CartProvider";
import { getSupabase } from "@/lib/supabase";
import { menuItemHasStock } from "@/lib/menuStock";
import type { MenuCategory, MenuItemWithVariants, MenuStockAvailability, MenuTopping } from "@/types/database";

interface MenuProps {
  hideHeader?: boolean;
}

type MenuCategoryWithItems = MenuCategory & {
  items: MenuItemWithVariants[];
};

/** Sentinel tab that drops the category filter entirely. */
const ALL_TAB = "all";

function menuPriceLabel(item: MenuItemWithVariants) {
  const prices = (item.menu_item_variants ?? [])
    .map((variant) => Number(variant.price))
    .filter((price) => Number.isFinite(price));
  const lowestPrice = prices.length > 0 ? Math.min(...prices) : Number(item.price);
  return `${prices.length > 1 ? "From " : ""}$${lowestPrice.toFixed(2)}`;
}

function sizeCount(item: MenuItemWithVariants) {
  const variantCount = (item.menu_item_variants ?? []).length;
  if (variantCount > 0) return variantCount;
  return item.sizes.split(",").filter((size) => size.trim()).length;
}

export const Menu = ({ hideHeader = false }: MenuProps) => {
  const { addItem } = useCart();
  const [categories, setCategories] = useState<MenuCategoryWithItems[]>([]);
  const [toppings, setToppings] = useState<MenuTopping[]>([]);
  const [stock, setStock] = useState<MenuStockAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string>(ALL_TAB);
  const [query, setQuery] = useState("");
  const [addingId, setAddingId] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<MenuItemWithVariants | null>(null);

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

  const trimmedQuery = query.trim().toLowerCase();

  const everyItem = useMemo(
    () => categories.flatMap((category) => category.items),
    [categories],
  );

  /** Search spans every category so people who know what they want skip the tabs. */
  const searchResults = useMemo(() => {
    if (!trimmedQuery) return [];
    return everyItem.filter(
      (item) =>
        item.name.toLowerCase().includes(trimmedQuery) ||
        item.description.toLowerCase().includes(trimmedQuery) ||
        item.ingredients.toLowerCase().includes(trimmedQuery),
    );
  }, [everyItem, trimmedQuery]);

  const activeCategory = categories.find((category) => category.id === activeCategoryId);
  const showingAll = !trimmedQuery && activeCategoryId === ALL_TAB;

  const visibleItems = trimmedQuery
    ? searchResults
    : showingAll
      ? everyItem
      : (activeCategory?.items ?? []);

  const handleQuickAdd = async (item: MenuItemWithVariants) => {
    setAddingId(item.id);
    try {
      await addDefaultToCart(item, addItem);
    } finally {
      setAddingId(null);
    }
  };

  return (
    <section className={hideHeader ? "pb-24 md:pb-32" : "section-padding"}>
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
            <div className="rounded border border-destructive/25 bg-destructive/5 px-6 py-12 text-center text-destructive">
              {error}
            </div>
          ) : categories.length === 0 ? (
            <div className="rounded border border-border bg-card px-6 py-12 text-center text-muted-foreground">
              New menu items are coming soon.
            </div>
          ) : (
            <>
              {/* Search + tabs stay pinned so the list is always navigable. */}
              <div className="sticky top-[88px] z-30 -mx-6 border-b border-border bg-background/95 px-6 py-4 backdrop-blur md:-mx-12 md:px-12 lg:-mx-20 lg:px-20">
                <div className="relative">
                  <Search
                    size={16}
                    strokeWidth={1.75}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={'Search drinks, e.g. "brown sugar" or "matcha"'}
                    aria-label="Search drinks"
                    className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-4 text-[14px] text-foreground placeholder:text-muted-foreground focus:border-accent/60 focus:outline-none focus:ring-1 focus:ring-accent/30"
                  />
                </div>

                <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1">
                  {[{ id: ALL_TAB, name: "All" }, ...categories].map((tab) => {
                    const isActive = !trimmedQuery && tab.id === activeCategoryId;

                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          setQuery("");
                          setActiveCategoryId(tab.id);
                        }}
                        aria-pressed={isActive}
                        className={`shrink-0 rounded-full border px-4 py-2 text-[13px] transition-colors duration-200 ${
                          isActive
                            ? "border-accent bg-accent text-accent-foreground"
                            : "border-border bg-card text-foreground hover:border-accent/50"
                        }`}
                      >
                        {tab.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mb-16 mt-9">
                <div className="mb-7">
                  <h3 className="font-serif text-2xl font-medium tracking-[-0.02em] text-foreground md:text-[1.75rem]">
                    {trimmedQuery
                      ? `Results for “${query.trim()}”`
                      : showingAll
                        ? "The full menu"
                        : activeCategory?.name}
                  </h3>
                  <p className="mt-1.5 max-w-2xl text-[14.5px] leading-[1.7] text-muted-foreground">
                    {trimmedQuery || showingAll
                      ? `${visibleItems.length} ${visibleItems.length === 1 ? "drink" : "drinks"} across ${categories.length} ${categories.length === 1 ? "category" : "categories"}`
                      : activeCategory?.description}
                  </p>
                </div>

                {visibleItems.length === 0 ? (
                  <div className="rounded border border-border bg-card px-6 py-12 text-center text-muted-foreground">
                    No drinks match “{query.trim()}”. Try another flavor or ingredient.
                  </div>
                ) : (
                  <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                    {visibleItems.map((item, index) => {
                      const inStock = menuItemHasStock(stock, item.id);
                      const badge = badgeFor(item.name);
                      const chips = chipsFor(item.allergens, sizeCount(item));

                      return (
                        <motion.article
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.45, delay: Math.min(index, 8) * 0.03 }}
                          className="group flex flex-col overflow-hidden rounded border border-border bg-card transition-colors duration-300 hover:border-accent/45"
                        >
                          <Link
                            to={`/product/${encodeURIComponent(item.name)}`}
                            onClick={(event) => {
                              if (event.metaKey || event.ctrlKey || event.shiftKey) return;
                              event.preventDefault();
                              setActiveItem(item);
                            }}
                            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          >
                            <div className="relative aspect-[4/3] overflow-hidden">
                              <img
                                src={item.image_url}
                                alt={item.name}
                                loading="lazy"
                                className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] ${
                                  inStock ? "" : "saturate-[0.5] brightness-[0.92]"
                                }`}
                              />
                              {!inStock ? (
                                <span className="absolute left-3.5 top-3.5 rounded-full bg-background/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-destructive">
                                  Sold out
                                </span>
                              ) : badge ? (
                                <span className="absolute left-3.5 top-3.5 rounded-full bg-background/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground">
                                  {badge}
                                </span>
                              ) : null}
                            </div>

                            <div className="px-5 pb-1 pt-4">
                              <div className="flex items-baseline justify-between gap-4">
                                <h4 className="text-[15px] font-semibold leading-snug text-foreground">
                                  {item.name}
                                </h4>
                                <span className="shrink-0 text-[15px] font-semibold tabular-nums text-accent">
                                  {menuPriceLabel(item)}
                                </span>
                              </div>
                              <p className="mt-1.5 line-clamp-2 text-[13px] leading-[1.6] text-muted-foreground">
                                {item.description}
                              </p>
                            </div>
                          </Link>

                          <div className="mt-auto px-5 pb-4">
                            {chips.length > 0 ? (
                              <div className="mt-3 flex flex-wrap gap-1.5">
                                {chips.map((chip) => (
                                  <span
                                    key={chip}
                                    className="rounded-full border border-border px-2 py-0.5 text-[10.5px] text-muted-foreground"
                                  >
                                    {chip}
                                  </span>
                                ))}
                              </div>
                            ) : null}

                            <div className="mt-3.5 flex items-center justify-between gap-3 border-t border-border pt-3.5">
                              <button
                                type="button"
                                onClick={() => setActiveItem(item)}
                                className="text-[11.5px] text-muted-foreground transition-colors hover:text-accent"
                              >
                                Tap to customize
                              </button>
                              <button
                                type="button"
                                disabled={!inStock || addingId === item.id}
                                onClick={() => void handleQuickAdd(item)}
                                className="inline-flex h-8 shrink-0 items-center gap-1 rounded-full bg-accent px-3.5 text-[12.5px] font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent-hover active:bg-accent-active disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-accent"
                              >
                                {addingId === item.id ? (
                                  <Loader2 size={13} className="animate-spin" />
                                ) : (
                                  <Plus size={13} strokeWidth={2.5} />
                                )}
                                Add
                              </button>
                            </div>
                          </div>
                        </motion.article>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}

          {!loading && !error && toppings.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-16 rounded border border-border bg-secondary p-8 md:p-12"
            >
              <h3 className="mb-8 text-center font-serif text-2xl font-medium tracking-[-0.02em]">
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
                      <h4 className="mb-5 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
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
                            className="group overflow-hidden rounded border border-border bg-card"
                          >
                            <div className="aspect-[5/3] overflow-hidden">
                              <img
                                src={topping.image_url}
                                alt={topping.name}
                                loading="lazy"
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                              />
                            </div>
                            <div className="flex items-baseline justify-between gap-2 px-3 py-2.5">
                              <span className="text-[13px] leading-tight text-foreground">
                                {topping.name}
                              </span>
                              {Number(topping.price) > 0 ? (
                                <span className="shrink-0 text-[12.5px] font-medium tabular-nums text-accent">
                                  ${Number(topping.price).toFixed(2)}
                                </span>
                              ) : null}
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

      <DrinkCustomizeModal
        item={activeItem}
        toppings={toppings}
        stock={stock}
        onClose={() => setActiveItem(null)}
      />
    </section>
  );
};
