import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Plus, Search } from "lucide-react";
import { MenuCardImage } from "@/components/MenuCardImage";
import { DrinkCustomizeModal } from "@/features/menu/components/DrinkCustomizeModal";
import { addDefaultToCart } from "@/features/menu/useDrinkCustomization";
import { badgeFor, chipsFor } from "@/features/menu/badges";
import { useMenuCatalog } from "@/features/menu/useMenuCatalog";
import { useCart } from "@/features/cart/CartProvider";
import { menuItemHasStock } from "@/lib/menuStock";
import { formatMoney } from "@/lib/money";
import { preloadMenuImages } from "@/lib/menuImageUrl";
import { resolveMenuCardImage, resolveToppingCardImage } from "@/lib/menuImages";
import type { MenuItemWithVariants } from "@/types/database";

const EXTRAS_PATTERN = /gelato|snack|sauce|topping|food|extra|ice cream/i;

interface MenuProps {
  hideHeader?: boolean;
}

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
  const { addItem, itemCount, subtotalCents } = useCart();
  const {
    data: catalog,
    isPending: loading,
    error: catalogError,
  } = useMenuCatalog();
  const categories = catalog?.categories ?? [];
  const toppings = catalog?.toppings ?? [];
  const stock = catalog?.stock ?? [];
  const optionLevels = catalog?.optionLevels ?? [];
  const itemOptionSettings = catalog?.itemOptionSettings ?? {};
  const itemToppingIds = catalog?.itemToppingIds ?? {};
  const error = catalogError
    ? catalogError instanceof Error
      ? catalogError.message
      : "We could not load the menu. Please try again."
    : null;
  /** Default tab is All so the full menu is visible on first paint. */
  const [activeCategoryId, setActiveCategoryId] = useState<string>(ALL_TAB);
  const [query, setQuery] = useState("");
  const [addingId, setAddingId] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<MenuItemWithVariants | null>(null);

  useEffect(() => {
    if (!catalog?.categories.length) return;
    setActiveCategoryId((current) => {
      if (current === ALL_TAB || current === "extras") return current;
      if (current && catalog.categories.some((category) => category.id === current)) {
        return current;
      }
      return ALL_TAB;
    });
    const firstPaintItems = catalog.categories.flatMap((category) => category.items).slice(0, 8);
    preloadMenuImages(
      firstPaintItems.map((item) => resolveMenuCardImage(item.name, item.image_url)),
      8,
    );
  }, [catalog]);

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

  const primaryCategories = useMemo(
    () => categories.filter((category) => !EXTRAS_PATTERN.test(category.name)),
    [categories],
  );
  const extrasCategories = useMemo(
    () => categories.filter((category) => EXTRAS_PATTERN.test(category.name)),
    [categories],
  );

  const resolvedActiveCategoryId = activeCategoryId || ALL_TAB;
  const activeCategory = categories.find((category) => category.id === resolvedActiveCategoryId);
  const showingAll = !trimmedQuery && resolvedActiveCategoryId === ALL_TAB;
  const showingExtras = !trimmedQuery && resolvedActiveCategoryId === "extras";

  useEffect(() => {
    if (!activeCategory || trimmedQuery || showingAll || showingExtras) return;
    preloadMenuImages(
      activeCategory.items.map((item) => resolveMenuCardImage(item.name, item.image_url)),
      8,
    );
  }, [activeCategory, trimmedQuery, showingAll, showingExtras]);

  const visibleSections = useMemo(() => {
    if (trimmedQuery) {
      return [{ id: "search", name: `Results for “${query.trim()}”`, description: `${searchResults.length} matches`, items: searchResults }];
    }
    if (showingExtras) {
      return extrasCategories.length > 0
        ? extrasCategories
        : [{ id: "extras", name: "Food & Extras", description: "Gelato, snacks, sauces & toppings à la carte", items: [] as MenuItemWithVariants[] }];
    }
    if (showingAll) return primaryCategories.length > 0 ? primaryCategories : categories;
    if (activeCategory) return [activeCategory];
    return [];
  }, [
    trimmedQuery,
    query,
    searchResults,
    showingExtras,
    showingAll,
    extrasCategories,
    primaryCategories,
    categories,
    activeCategory,
  ]);

  const handleQuickAdd = async (item: MenuItemWithVariants) => {
    setAddingId(item.id);
    try {
      await addDefaultToCart(item, addItem, optionLevels, itemOptionSettings[item.id] ?? null);
    } finally {
      setAddingId(null);
    }
  };

  const scrollToCategory = (categoryId: string) => {
    setQuery("");
    setActiveCategoryId(categoryId);
    if (categoryId === ALL_TAB || categoryId === "extras") return;
    requestAnimationFrame(() => {
      document.getElementById(`cat-${categoryId}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const renderCard = (item: MenuItemWithVariants, index: number, priority = false) => {
    const inStock = menuItemHasStock(stock, item.id);
    const badge = badgeFor(item);
    const chips = chipsFor(item.allergens, sizeCount(item));

    return (
      <motion.article
        key={item.id}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "80px 0px" }}
        transition={{ duration: 0.25, delay: Math.min(index, 4) * 0.02 }}
        className="group flex flex-col overflow-hidden rounded-[14px] border border-border bg-white transition-[box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(74,54,38,0.1)] [content-visibility:auto] [contain-intrinsic-size:320px]"
      >
        <Link
          to={`/product/${encodeURIComponent(item.name)}`}
          onClick={(event) => {
            if (!inStock) {
              event.preventDefault();
              return;
            }
            if (event.metaKey || event.ctrlKey || event.shiftKey) return;
            event.preventDefault();
            setActiveItem(item);
          }}
          aria-disabled={!inStock}
          className={`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
            inStock ? "" : "cursor-not-allowed"
          }`}
        >
          <div className="relative">
            <MenuCardImage
              src={resolveMenuCardImage(item.name, item.image_url)}
              alt={item.name}
              priority={priority}
              imgClassName={inStock ? "" : "saturate-[0.5] brightness-[0.92]"}
            />
            {!inStock ? (
              <span className="absolute left-2.5 top-2.5 z-10 rounded-md bg-white px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.04em] text-destructive shadow-[0_1px_3px_rgba(42,31,22,0.18)]">
                Sold out
              </span>
            ) : badge ? (
              <span className="absolute left-2.5 top-2.5 z-10 whitespace-nowrap rounded-md bg-white px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.04em] text-accent-hover shadow-[0_1px_3px_rgba(42,31,22,0.18)]">
                {badge}
              </span>
            ) : null}
          </div>

          <div className="px-[15px] pb-1 pt-[13px]">
            <div className="mb-1 flex items-start justify-between gap-2">
              <h4 className="text-[14px] font-semibold leading-[1.3] text-foreground">
                {item.name}
              </h4>
              <span className="shrink-0 text-[13.5px] font-semibold tabular-nums text-accent-hover">
                {menuPriceLabel(item)}
              </span>
            </div>
            <p className="mb-2.5 line-clamp-2 text-[12px] leading-[1.55] text-muted-foreground">
              {item.description}
            </p>
          </div>
        </Link>

        <div className="mt-auto px-[15px] pb-[15px]">
          {chips.length > 0 ? (
            <div className="mb-2.5 flex flex-wrap gap-1.5">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-[10px] border border-border bg-background px-2 py-0.5 text-[10px] font-medium text-foreground"
                >
                  {chip}
                </span>
              ))}
            </div>
          ) : null}

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={!inStock}
              onClick={() => {
                if (!inStock) return;
                setActiveItem(item);
              }}
              className="text-[10.5px] text-muted-foreground transition-colors hover:text-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-muted-foreground"
            >
              {inStock ? "Tap to customize" : "Unavailable"}
            </button>
            <button
              type="button"
              disabled={!inStock || addingId === item.id}
              onClick={() => void handleQuickAdd(item)}
              className="inline-flex items-center gap-1 rounded-2xl bg-accent px-3.5 py-1.5 text-[11.5px] font-semibold text-white transition-colors hover:bg-accent-hover active:bg-accent-active disabled:cursor-not-allowed disabled:opacity-40"
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
  };

  return (
    <section className={hideHeader ? "pb-24 md:pb-16" : "section-padding"}>
      <div className="mx-auto max-w-[1100px]">
        {!hideHeader ? (
          <div className="mb-10 px-5 text-center md:px-8">
            <span className="mb-3 inline-block text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-hover">
              Order Now
            </span>
            <h2 className="font-serif text-[28px] font-semibold text-foreground">Browse &amp; order</h2>
          </div>
        ) : null}

        {loading ? (
          <div className="flex min-h-72 items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading the menu...</span>
          </div>
        ) : error ? (
          <div className="mx-5 rounded border border-destructive/25 bg-destructive/5 px-6 py-12 text-center text-destructive md:mx-8">
            {error}
          </div>
        ) : categories.length === 0 ? (
          <div className="mx-5 rounded border border-border bg-white px-6 py-12 text-center text-muted-foreground md:mx-8">
            New menu items are coming soon.
          </div>
        ) : (
          <>
            <div className="px-4 pt-5 md:px-8">
              <div className="relative w-full">
                <Search
                  size={15}
                  strokeWidth={1.75}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={'Search drinks, e.g. "brown sugar" or "matcha"'}
                  aria-label="Search drinks"
                  className="w-full rounded-[10px] border border-border bg-white py-3 pl-10 pr-4 text-[13px] text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            <div className="sticky top-[73px] z-30 border-b border-border bg-background px-4 pb-3 pt-[18px] md:px-8">
              <div className="menu-category-tabs flex gap-2 overflow-x-auto pb-2.5">
                <button
                  type="button"
                  onClick={() => scrollToCategory(ALL_TAB)}
                  aria-pressed={showingAll}
                  className={`shrink-0 rounded-full border px-4 py-2 text-[13px] font-medium transition-colors ${
                    showingAll
                      ? "border-accent bg-accent text-white"
                      : "border-border bg-white text-foreground"
                  }`}
                >
                  All
                </button>
                {primaryCategories.map((tab) => {
                  const isActive = !trimmedQuery && tab.id === resolvedActiveCategoryId;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => scrollToCategory(tab.id)}
                      aria-pressed={isActive}
                      className={`shrink-0 rounded-full border px-4 py-2 text-[13px] font-medium transition-colors ${
                        isActive
                          ? "border-accent bg-accent text-white"
                          : "border-border bg-white text-foreground"
                      }`}
                    >
                      {tab.name}
                    </button>
                  );
                })}
                {(extrasCategories.length > 0 || toppings.length > 0) ? (
                  <button
                    type="button"
                    onClick={() => scrollToCategory("extras")}
                    aria-pressed={showingExtras}
                    className={`shrink-0 rounded-full border border-dashed px-4 py-2 text-[13px] font-medium transition-colors ${
                      showingExtras
                        ? "border-accent bg-accent text-white"
                        : "border-border bg-white text-foreground"
                    }`}
                  >
                    Food &amp; Extras +
                  </button>
                ) : null}
              </div>
            </div>

            <div className="space-y-2 px-4 pb-[90px] pt-7 md:px-8 md:pb-[60px]">
              {visibleSections.every((section) => section.items.length === 0) ? (
                <div className="rounded border border-border bg-white px-6 py-12 text-center text-muted-foreground">
                  {trimmedQuery
                    ? `No drinks match “${query.trim()}”. Try another flavor or ingredient.`
                    : "Nothing in this category yet."}
                </div>
              ) : (
                (() => {
                  let priorityBudget = 0;
                  return visibleSections.map((section) =>
                    section.items.length === 0 ? null : (
                      <div key={section.id} id={`cat-${section.id}`} className="scroll-mt-40 pb-10">
                        {showingExtras ? (
                          <div className="mb-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-hover">
                            Food &amp; Extras
                          </div>
                        ) : null}
                        <div className="font-serif text-[20px] font-semibold text-foreground">
                          {section.name}
                        </div>
                        <p className="mb-[22px] mt-0.5 text-[13px] text-muted-foreground">
                          {section.description}
                        </p>
                        <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
                          {section.items.map((item, index) => {
                            const priority = priorityBudget < 6;
                            if (priority) priorityBudget += 1;
                            return renderCard(item, index, priority);
                          })}
                        </div>
                      </div>
                    ),
                  );
                })()
              )}

              {showingExtras && toppings.length > 0 ? (
                <div id="cat-extras" className="scroll-mt-40 pb-6">
                  <div className="mb-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-hover">
                    Food &amp; Extras
                  </div>
                  <div className="font-serif text-[20px] font-semibold text-foreground">
                    Toppings à la carte
                  </div>
                  <p className="mb-[22px] mt-0.5 text-[13px] text-muted-foreground">
                    Secondary items — kept one tap away so the main menu stays scannable.
                  </p>
                  <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
                    {toppings.map((topping, index) => (
                      <div
                        key={topping.id}
                        className="overflow-hidden rounded-[14px] border border-border bg-white"
                      >
                        <MenuCardImage
                          src={resolveToppingCardImage(topping.name, topping.image_url)}
                          alt={topping.name}
                          priority={index < 3}
                        />
                        <div className="flex items-center justify-between gap-2 px-[15px] py-[13px]">
                          <span className="text-[14px] font-semibold">{topping.name}</span>
                          {Number(topping.price) > 0 ? (
                            <span className="text-[13.5px] font-semibold text-accent-hover">
                              ${Number(topping.price).toFixed(2)}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </>
        )}
      </div>

      {itemCount > 0 ? (
        <Link
          to="/cart"
          className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between bg-foreground px-[18px] py-3.5 text-[13px] font-semibold text-white md:hidden"
        >
          <span>
            {itemCount} {itemCount === 1 ? "item" : "items"} · {formatMoney(subtotalCents)}
          </span>
          <span className="rounded-md bg-accent px-3.5 py-2 text-[12.5px]">View cart →</span>
        </Link>
      ) : null}

      <DrinkCustomizeModal
        item={activeItem}
        toppings={toppings}
        stock={stock}
        optionLevels={optionLevels}
        itemSettings={activeItem ? itemOptionSettings[activeItem.id] ?? null : null}
        allowedToppingIds={
          activeItem && activeItem.id in itemToppingIds
            ? itemToppingIds[activeItem.id]
            : null
        }
        onClose={() => setActiveItem(null)}
      />
    </section>
  );
};
