import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { formatMoney } from "@/lib/money";
import { availableQuantity, fetchMenuStock } from "@/lib/menuStock";
import {
  buildCartVariantId,
  useCart,
  type CartToppingSelection,
} from "@/features/cart/CartProvider";
import { getSupabase } from "@/lib/supabase";
import type { MenuItemWithVariants, MenuStockAvailability, MenuTopping } from "@/types/database";
import NotFound from "@/pages/NotFound";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function variantsFor(item: MenuItemWithVariants) {
  const variants = [...(item.menu_item_variants ?? [])].sort(
    (left, right) => left.sort_order - right.sort_order,
  );
  if (variants.length > 0) return variants;

  return item.sizes
    .split(",")
    .map((size) => size.trim())
    .filter(Boolean)
    .map((size, index) => ({
      id: `legacy-${index}-${size}`,
      menu_item_id: item.id,
      size,
      price: item.price,
      sort_order: index,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));
}

export const ProductDetail = () => {
  const { productName } = useParams<{ productName: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [item, setItem] = useState<MenuItemWithVariants | null>(null);
  const [stock, setStock] = useState<MenuStockAvailability[]>([]);
  const [toppings, setToppings] = useState<MenuTopping[]>([]);
  const [selectedToppingIds, setSelectedToppingIds] = useState<string[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const decodedName = productName ? decodeURIComponent(productName) : "";

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
      const sizes = variantsFor(menuItem).map((variant) => variant.size);
      const firstAvailableSize =
        sizes.find(
          (size) => availableQuantity(currentStock, menuItem.id, size) > 0,
        ) ?? "";

      setItem(menuItem);
      setStock(currentStock);
      setToppings((toppingResult.data ?? []) as MenuTopping[]);
      setSelectedToppingIds([]);
      setCategoryName((category as { name?: string } | null)?.name ?? "ToTea menu");
      setSelectedSize(firstAvailableSize);
      setLoading(false);
    }

    void loadItem();
    return () => {
      cancelled = true;
    };
  }, [decodedName]);

  const variants = useMemo(() => (item ? variantsFor(item) : []), [item]);
  const sizes = useMemo(
    () => variants.map((variant) => variant.size),
    [variants],
  );
  const ingredients = useMemo(
    () =>
      item?.ingredients
        .split(",")
        .map((ingredient) => ingredient.trim())
        .filter(Boolean) ?? [],
    [item],
  );

  const selectedToppings = useMemo(
    () => toppings.filter((topping) => selectedToppingIds.includes(topping.id)),
    [toppings, selectedToppingIds],
  );

  const selectedToppingSelections: CartToppingSelection[] = useMemo(
    () =>
      selectedToppings.map((topping) => ({
        id: topping.id,
        name: topping.name,
        price_cents: Math.round(Number(topping.price) * 100),
      })),
    [selectedToppings],
  );

  const toppingsPriceCents = useMemo(
    () => selectedToppingSelections.reduce((sum, topping) => sum + topping.price_cents, 0),
    [selectedToppingSelections],
  );

  const selectedVariant = variants.find(
    (variant) => variant.size.toLowerCase() === selectedSize.toLowerCase(),
  );
  const basePriceCents = selectedVariant
    ? Math.round(Number(selectedVariant.price) * 100)
    : 0;
  const totalUnitPriceCents = basePriceCents + toppingsPriceCents;

  const toppingGroups = useMemo(
    () =>
      [
        { title: "Standard toppings", category: "standard" as const },
        { title: "Cream toppings", category: "cream" as const },
      ]
        .map((group) => ({
          ...group,
          items: toppings.filter((topping) => topping.category === group.category),
        }))
        .filter((group) => group.items.length > 0),
    [toppings],
  );

  const toggleTopping = (toppingId: string) => {
    setSelectedToppingIds((current) =>
      current.includes(toppingId)
        ? current.filter((id) => id !== toppingId)
        : [...current, toppingId],
    );
  };

  if (loading) {
    return (
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden pt-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 25% 35%, hsl(28 45% 72% / 0.35), transparent 58%), linear-gradient(160deg, #f3ebe1 0%, #ebe0d2 40%, #f6efe7 100%)",
          }}
        />
        <div className="relative flex items-center gap-3 text-[#6b5c4d]">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="font-serif text-lg italic">Brewing the details…</span>
        </div>
      </section>
    );
  }

  if (notFound || !item) return <NotFound />;

  const selectedQuantity = selectedSize
    ? availableQuantity(stock, item.id, selectedSize)
    : 0;
  const hasAvailableSize = sizes.some(
    (size) => availableQuantity(stock, item.id, size) > 0,
  );

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error("This item is currently unavailable.");
      return;
    }

    const supabase = getSupabase();
    if (!supabase) {
      toast.error("We could not confirm live stock. Please try again.");
      return;
    }

    setAdding(true);
    try {
      const currentStock = await fetchMenuStock(supabase, item.id);
      setStock(currentStock);
      const currentQuantity = availableQuantity(
        currentStock,
        item.id,
        selectedSize,
      );

      if (currentQuantity < 1) {
        const nextAvailableSize =
          sizes.find(
            (size) => availableQuantity(currentStock, item.id, size) > 0,
          ) ?? "";
        setSelectedSize(nextAvailableSize);
        toast.error(
          nextAvailableSize
            ? `${selectedSize} is no longer available. Choose another size.`
            : "This item is currently unavailable.",
        );
        return;
      }

      await addItem({
        product_id: item.id,
        product_variant_id: buildCartVariantId(
          item.id,
          selectedSize,
          selectedToppingSelections,
        ),
        product_name: item.name,
        product_image: item.image_url,
        selected_options: {
          size: selectedSize,
          toppings: selectedToppingSelections,
        },
        unit_price_cents: totalUnitPriceCents,
        stock_quantity: currentQuantity,
        quantity: 1,
      });
    } catch (stockError) {
      console.error("Unable to confirm live menu stock", stockError);
      toast.error("We could not confirm live stock. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <section className="relative pt-24 md:pt-28">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 12% 30%, hsl(30 42% 78% / 0.55), transparent 62%), radial-gradient(ellipse 50% 45% at 92% 78%, hsl(22 35% 68% / 0.22), transparent 55%), linear-gradient(155deg, #f4ebe2 0%, #e8dccf 38%, #f7f0e8 72%, #efe4d7 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.045] mix-blend-multiply"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      <div className="container relative mx-auto px-6 pb-24 md:px-12 md:pb-32 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            onClick={() => navigate(-1)}
            className="mb-12 inline-flex items-center gap-2 text-[13px] text-[#7a6a5a] transition-colors hover:text-[#3d3228] md:mb-16"
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
                className="relative"
              >
                <div
                  aria-hidden
                  className="absolute -left-10 top-1/4 h-2/3 w-3/4 rounded-full blur-3xl"
                  style={{
                    background:
                      "radial-gradient(circle, hsl(28 40% 55% / 0.28), transparent 70%)",
                  }}
                />

                <figure className="relative">
                  <div
                    className="relative aspect-[5/6] overflow-hidden"
                    style={{
                      borderRadius: "1.75rem 1.75rem 2.5rem 1.75rem",
                      boxShadow:
                        "0 28px 60px -28px rgba(62, 42, 24, 0.45), 0 8px 24px -12px rgba(62, 42, 24, 0.2)",
                    }}
                  >
                    <motion.img
                      src={item.image_url}
                      alt={item.name}
                      initial={{ scale: 1.06 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
                      className={`h-full w-full object-cover ${
                        hasAvailableSize ? "" : "saturate-[0.6] brightness-[0.92]"
                      }`}
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(185deg, hsl(30 30% 20% / 0.08) 0%, transparent 35%, hsl(25 40% 12% / 0.35) 100%)",
                      }}
                    />

                    {!hasAvailableSize ? (
                      <span className="absolute left-6 top-6 bg-[#f7f0e8]/95 px-3 py-1.5 font-serif text-sm italic text-[#8b3a2a] backdrop-blur-sm">
                        Currently unavailable
                      </span>
                    ) : null}
                  </div>

                  <figcaption className="mt-5 flex items-baseline justify-between gap-4 px-1">
                    <span className="font-serif text-[13px] italic text-[#8a7764]">
                      Handcrafted to order
                    </span>
                    <span className="font-serif text-2xl font-medium tracking-tight text-[#2f261e] md:text-[1.75rem]">
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
              <p className="mb-3 font-serif text-[15px] italic text-[#b07a3a]">
                {categoryName}
              </p>

              <h1 className="font-serif text-[2.65rem] font-medium leading-[1.12] tracking-[-0.02em] text-[#2a2119] md:text-[3.15rem] lg:text-[3.4rem]">
                {item.name}
              </h1>

              <p className="mt-5 max-w-md text-[15px] leading-[1.75] text-[#6e5f50] md:text-base">
                {item.description}
              </p>

              <p className="mt-6 text-[13px] leading-relaxed text-[#8a7764]">
                <span className="text-[#2f261e]/70">{item.calories}</span>
                <span className="mx-2.5 text-[#c4b5a4]">·</span>
                <span>{item.allergens}</span>
              </p>

              {!hasAvailableSize ? (
                <p className="mt-6 border-l-2 border-[#c47a6a] pl-4 text-sm leading-relaxed text-[#8b4a3a]">
                  This item is temporarily unavailable because one or more ingredients
                  are out of stock.
                </p>
              ) : null}

              <div className="mt-11">
                <h3 className="mb-5 font-serif text-lg text-[#2a2119]">Choose a size</h3>
                <div className="flex flex-wrap gap-x-8 gap-y-3">
                  {sizes.map((size) => {
                    const quantity = availableQuantity(stock, item.id, size);
                    const isAvailable = quantity > 0;
                    const isSelected = selectedSize === size;
                    const sizePriceCents = Math.round(
                      Number(variants.find((variant) => variant.size === size)?.price ?? 0) * 100,
                    );

                    return (
                      <button
                        key={size}
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => setSelectedSize(size)}
                        className={`relative pb-1.5 font-serif text-xl transition-colors duration-300 ${
                          isSelected
                            ? "text-[#2a2119]"
                            : isAvailable
                              ? "text-[#9a8876] hover:text-[#5c4d3e]"
                              : "cursor-not-allowed text-[#cfc3b5] line-through"
                        }`}
                      >
                        {size}
                        <span
                          className={`ml-2 text-[15px] tabular-nums ${
                            isSelected ? "text-[#8b5e34]" : "text-[#9a8876]"
                          }`}
                        >
                          {formatMoney(sizePriceCents)}
                        </span>
                        {isSelected ? (
                          <motion.span
                            layoutId="size-underline"
                            className="absolute inset-x-0 -bottom-0.5 h-px bg-[#b07a3a]"
                          />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>

              {ingredients.length > 0 ? (
                <div className="mt-11">
                  <h3 className="mb-4 font-serif text-lg text-[#2a2119]">Ingredients</h3>
                  <p className="max-w-md font-serif text-[17px] italic leading-[1.85] text-[#6e5f50]">
                    {ingredients.join("  ·  ")}
                  </p>
                </div>
              ) : null}

              {toppingGroups.length > 0 ? (
                <div className="mt-11">
                  <h3 className="mb-1 font-serif text-lg text-[#2a2119]">Add toppings</h3>
                  <p className="mb-6 text-[13px] text-[#8a7764]">
                    Optional extras, prepared with your drink.
                  </p>

                  <div className="space-y-8">
                    {toppingGroups.map((group) => (
                      <div key={group.category}>
                        <h4 className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[#9a8876]">
                          {group.title}
                        </h4>
                        <ul className="divide-y divide-[#ddd0c0]/80 border-y border-[#ddd0c0]/80">
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
                                    className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-sm border transition-all duration-300 ${
                                      selected
                                        ? "border-[#8b5e34] bg-[#8b5e34] text-[#f7f0e8]"
                                        : "border-[#c4b5a4] bg-transparent text-transparent group-hover:border-[#8b5e34]/60"
                                    }`}
                                  >
                                    <Check size={11} strokeWidth={2.5} />
                                  </span>
                                  <span
                                    className={`min-w-0 flex-1 text-[15px] transition-colors ${
                                      selected ? "text-[#2a2119]" : "text-[#5c4d3e]"
                                    }`}
                                  >
                                    {topping.name}
                                  </span>
                                  <span
                                    className="mx-2 hidden flex-1 border-b border-dotted border-[#cfc3b5] sm:block"
                                    aria-hidden
                                  />
                                  <span
                                    className={`shrink-0 font-serif text-[15px] tabular-nums ${
                                      selected ? "text-[#8b5e34]" : "text-[#9a8876]"
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
                  onClick={() => void handleAddToCart()}
                  className="h-[3.25rem] flex-1 rounded-full border-0 px-8 text-[15px] font-medium tracking-wide text-[#f7f0e8] shadow-[0_14px_36px_-16px_rgba(62,42,24,0.55)] transition-all duration-300 hover:brightness-110 hover:shadow-[0_18px_40px_-14px_rgba(62,42,24,0.5)] disabled:opacity-50"
                  style={{
                    background: "linear-gradient(160deg, #4a3728 0%, #2f241c 100%)",
                  }}
                >
                  {adding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {hasAvailableSize
                    ? `Add to cart · ${formatMoney(totalUnitPriceCents)}`
                    : "Unavailable"}
                </Button>
                <button
                  type="button"
                  onClick={() => navigate("/cart")}
                  className="px-2 py-3 font-serif text-[15px] italic text-[#7a6a5a] underline-offset-4 transition-colors hover:text-[#2a2119] hover:underline sm:px-4"
                >
                  View cart
                </button>
              </div>

              {toppingsPriceCents > 0 ? (
                <p className="mt-4 text-[12px] text-[#9a8876]">
                  Includes {formatMoney(toppingsPriceCents)} in selected toppings
                </p>
              ) : null}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
