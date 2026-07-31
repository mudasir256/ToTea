import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { formatMoney } from "@/lib/money";
import { availableQuantity, fetchMenuStock } from "@/lib/menuStock";
import { useDrinkCustomization } from "@/features/menu/useDrinkCustomization";
import { getSupabase } from "@/lib/supabase";
import type { MenuItemWithVariants, MenuStockAvailability, MenuTopping } from "@/types/database";
import NotFound from "@/pages/NotFound";
import { Button } from "@/components/ui/button";

export const ProductDetail = () => {
  const { productName } = useParams<{ productName: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<MenuItemWithVariants | null>(null);
  const [initialStock, setInitialStock] = useState<MenuStockAvailability[]>([]);
  const [toppings, setToppings] = useState<MenuTopping[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const decodedName = productName ? decodeURIComponent(productName) : "";

  const {
    stock,
    sizes,
    selectedSize,
    setSelectedSize,
    selectedToppingIds,
    toggleTopping,
    toppingGroups,
    adding,
    toppingsPriceCents,
    totalUnitPriceCents,
    selectedQuantity,
    hasAvailableSize,
    priceForSize,
    addToCart,
  } = useDrinkCustomization(item, toppings, initialStock);

  useEffect(() => {
    let cancelled = false;

    async function loadItem() {
      if (!decodedName) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      const supabase = getSupabase();
      if (!supabase) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const [itemResult, toppingResult] = await Promise.all([
        supabase
          .from("menu_items")
          .select("*, menu_item_variants(*)")
          .eq("name", decodedName)
          .eq("is_available", true)
          .maybeSingle(),
        supabase
          .from("menu_toppings")
          .select("*")
          .eq("is_available", true)
          .order("sort_order", { ascending: true }),
      ]);

      if (cancelled) return;

      const menuItem = itemResult.data as MenuItemWithVariants | null;
      if (itemResult.error || !menuItem) {
        if (itemResult.error) console.error("Unable to load menu item", itemResult.error);
        setNotFound(true);
        setLoading(false);
        return;
      }
      if (toppingResult.error) {
        console.error("Unable to load toppings", toppingResult.error);
      }

      const { data: category } = await supabase
        .from("menu_categories")
        .select("name")
        .eq("id", menuItem.category_id)
        .eq("is_active", true)
        .maybeSingle();

      let currentStock: MenuStockAvailability[] = [];
      try {
        currentStock = await fetchMenuStock(supabase, menuItem.id);
      } catch (stockError) {
        console.error("Unable to load live menu stock", stockError);
      }

      if (cancelled) return;

      setItem(menuItem);
      setInitialStock(currentStock);
      setToppings((toppingResult.data ?? []) as MenuTopping[]);
      setCategoryName((category as { name?: string } | null)?.name ?? "ToTea menu");
      setLoading(false);
    }

    void loadItem();
    return () => {
      cancelled = true;
    };
  }, [decodedName]);

  const ingredients = useMemo(
    () =>
      item?.ingredients
        .split(",")
        .map((ingredient) => ingredient.trim())
        .filter(Boolean) ?? [],
    [item],
  );

  if (loading) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-background pt-24">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="font-serif text-lg italic">Brewing the details…</span>
        </div>
      </section>
    );
  }

  if (notFound || !item) return <NotFound />;

  return (
    <section className="bg-background pt-24 md:pt-28">
      <div className="container mx-auto px-6 pb-24 md:px-12 md:pb-32 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            onClick={() => navigate(-1)}
            className="mb-12 inline-flex items-center gap-2 text-[13px] text-muted-foreground transition-colors hover:text-foreground md:mb-16"
          >
            <ArrowLeft size={15} strokeWidth={1.5} />
            <span className="font-serif italic">Back to the menu</span>
          </motion.button>

          <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16 xl:gap-24">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <figure>
                  <div className="relative aspect-[5/6] overflow-hidden rounded border border-border">
                    <motion.img
                      src={item.image_url}
                      alt={item.name}
                      initial={{ scale: 1.06 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
                      className={`h-full w-full object-cover ${
                        hasAvailableSize ? "" : "saturate-[0.5] brightness-[0.92]"
                      }`}
                    />

                    {!hasAvailableSize ? (
                      <span className="absolute left-5 top-5 rounded-full bg-background/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-destructive">
                        Sold out
                      </span>
                    ) : null}
                  </div>

                  <figcaption className="mt-5 flex items-baseline justify-between gap-4">
                    <span className="font-serif text-[13px] italic text-muted-foreground">
                      Handcrafted to order
                    </span>
                    <span className="font-serif text-2xl font-medium tracking-[-0.02em] text-accent md:text-[1.75rem]">
                      {formatMoney(totalUnitPriceCents)}
                    </span>
                  </figcaption>
                </figure>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col lg:pt-4"
            >
              <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
                {categoryName}
              </p>

              <h1 className="font-serif text-[2.65rem] font-medium leading-[1.12] tracking-[-0.02em] text-foreground md:text-[3.15rem] lg:text-[3.4rem]">
                {item.name}
              </h1>

              <p className="mt-5 max-w-md text-[15px] leading-[1.75] text-muted-foreground md:text-base">
                {item.description}
              </p>

              <p className="mt-6 text-[13px] leading-relaxed text-muted-foreground">
                <span>{item.calories}</span>
                <span className="mx-2.5 text-border">·</span>
                <span>{item.allergens}</span>
              </p>

              {!hasAvailableSize ? (
                <p className="mt-6 border-l-2 border-destructive/50 pl-4 text-sm leading-relaxed text-destructive">
                  This item is temporarily unavailable because one or more ingredients
                  are out of stock.
                </p>
              ) : null}

              <div className="mt-11">
                <h3 className="mb-5 font-serif text-lg text-foreground">Choose a size</h3>
                <div className="flex flex-wrap gap-x-8 gap-y-3">
                  {sizes.map((size) => {
                    const isAvailable = availableQuantity(stock, item.id, size) > 0;
                    const isSelected = selectedSize === size;

                    return (
                      <button
                        key={size}
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => setSelectedSize(size)}
                        className={`relative pb-1.5 font-serif text-xl transition-colors duration-300 ${
                          isSelected
                            ? "text-foreground"
                            : isAvailable
                              ? "text-muted-foreground hover:text-foreground"
                              : "cursor-not-allowed text-muted-foreground/50 line-through"
                        }`}
                      >
                        {size}
                        <span
                          className={`ml-2 text-[15px] tabular-nums ${
                            isSelected ? "text-accent" : "text-muted-foreground"
                          }`}
                        >
                          {formatMoney(priceForSize(size))}
                        </span>
                        {isSelected ? (
                          <motion.span
                            layoutId="size-underline"
                            className="absolute inset-x-0 -bottom-0.5 h-px bg-accent"
                          />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>

              {ingredients.length > 0 ? (
                <div className="mt-11">
                  <h3 className="mb-4 font-serif text-lg text-foreground">Ingredients</h3>
                  <p className="max-w-md font-serif text-[17px] italic leading-[1.85] text-muted-foreground">
                    {ingredients.join("  ·  ")}
                  </p>
                </div>
              ) : null}

              {toppingGroups.length > 0 ? (
                <div className="mt-11">
                  <h3 className="mb-1 font-serif text-lg text-foreground">Add toppings</h3>
                  <p className="mb-6 text-[13px] text-muted-foreground">
                    Optional extras, prepared with your drink.
                  </p>

                  <div className="space-y-8">
                    {toppingGroups.map((group) => (
                      <div key={group.category}>
                        <h4 className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                          {group.title}
                        </h4>
                        <ul className="divide-y divide-border border-y border-border">
                          {group.items.map((topping) => {
                            const selected = selectedToppingIds.includes(topping.id);
                            const priceCents = Math.round(Number(topping.price) * 100);

                            return (
                              <li key={topping.id}>
                                <button
                                  type="button"
                                  onClick={() => toggleTopping(topping.id)}
                                  aria-pressed={selected}
                                  className="group flex w-full items-center gap-3 py-3.5 text-left transition-colors"
                                >
                                  <span
                                    className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-sm border transition-colors duration-200 ${
                                      selected
                                        ? "border-accent bg-accent text-accent-foreground"
                                        : "border-border bg-card text-transparent group-hover:border-accent/60"
                                    }`}
                                  >
                                    <Check size={11} strokeWidth={3} />
                                  </span>
                                  <span
                                    className={`min-w-0 flex-1 text-[15px] transition-colors ${
                                      selected ? "text-foreground" : "text-foreground/80"
                                    }`}
                                  >
                                    {topping.name}
                                  </span>
                                  <span
                                    className="mx-2 hidden flex-1 border-b border-dotted border-border sm:block"
                                    aria-hidden
                                  />
                                  <span
                                    className={`shrink-0 text-[15px] tabular-nums ${
                                      selected ? "text-accent" : "text-muted-foreground"
                                    }`}
                                  >
                                    {priceCents > 0 ? `+${formatMoney(priceCents)}` : "—"}
                                  </span>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Button
                  type="button"
                  disabled={adding || selectedQuantity < 1}
                  onClick={() => void addToCart()}
                  className="h-[3.25rem] flex-1 rounded-full border-0 bg-accent px-8 text-[15px] font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent-hover active:bg-accent-active disabled:opacity-45 disabled:hover:bg-accent"
                >
                  {adding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {hasAvailableSize
                    ? `Add to cart · ${formatMoney(totalUnitPriceCents)}`
                    : "Unavailable"}
                </Button>
                <button
                  type="button"
                  onClick={() => navigate("/cart")}
                  className="px-2 py-3 font-serif text-[15px] italic text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline sm:px-4"
                >
                  View cart
                </button>
              </div>

              {toppingsPriceCents > 0 ? (
                <p className="mt-4 text-[12px] text-muted-foreground">
                  Includes {formatMoney(toppingsPriceCents)} in selected extras
                </p>
              ) : null}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
