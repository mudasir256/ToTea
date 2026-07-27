import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Loader2, ShoppingCart } from "lucide-react";
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
      if (itemResult.error || !itemResult.data) {
        if (itemResult.error) console.error("Unable to load menu item", itemResult.error);
        setNotFound(true);
        setLoading(false);
        return;
      }
      if (toppingResult.error) {
        console.error("Unable to load toppings", toppingResult.error);
      }

      const menuItem = itemResult.data as MenuItemWithVariants;
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
      <section className="section-padding flex min-h-[70vh] items-center justify-center pt-24">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading item...</span>
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
    <section className="section-padding pt-24 md:pt-32">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft size={18} />
              <span>Back to Menu</span>
            </button>
          </motion.div>

          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative aspect-square overflow-hidden rounded-4xl shadow-elevated">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className={`h-full w-full object-cover ${
                    hasAvailableSize ? "" : "saturate-[0.7]"
                  }`}
                />
                {!hasAvailableSize ? (
                  <span className="absolute left-5 top-5 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-red-700 shadow-lg">
                    Unavailable
                  </span>
                ) : null}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col"
            >
              <div className="mb-4">
                <span className="inline-block rounded-full border border-border/50 bg-secondary px-4 py-2 text-sm font-medium text-muted-foreground">
                  {categoryName}
                </span>
              </div>

              <h1 className="heading-lg mb-4 text-foreground">{item.name}</h1>
              <p className="body-lg mb-8 leading-relaxed text-muted-foreground">
                {item.description}
              </p>

              <div className="mb-8 grid gap-6 sm:grid-cols-2">
                <div className="rounded-3xl border border-border bg-secondary p-6">
                  <h3 className="mb-2 text-sm uppercase tracking-wider text-muted-foreground">
                    Price
                  </h3>
                  <p className="text-2xl font-bold text-foreground">
                    {formatMoney(totalUnitPriceCents)}
                  </p>
                  {toppingsPriceCents > 0 ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Includes {formatMoney(toppingsPriceCents)} in toppings
                    </p>
                  ) : null}
                </div>
                <div className="rounded-3xl border border-border bg-secondary p-6">
                  <h3 className="mb-2 text-sm uppercase tracking-wider text-muted-foreground">
                    Choose size
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => {
                      const quantity = availableQuantity(stock, item.id, size);
                      const isAvailable = quantity > 0;

                      return (
                        <button
                          key={size}
                          type="button"
                          disabled={!isAvailable}
                          onClick={() => setSelectedSize(size)}
                          className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
                            selectedSize === size
                              ? "border-accent bg-accent text-accent-foreground"
                              : isAvailable
                                ? "border-border bg-background hover:border-accent/50"
                                : "cursor-not-allowed border-border/60 bg-muted/60 text-muted-foreground line-through opacity-70"
                          }`}
                        >
                          {size}
                          <span className="ml-1 opacity-75">
                            · {formatMoney(Math.round(Number(variants.find((variant) => variant.size === size)?.price ?? 0) * 100))}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {!hasAvailableSize ? (
                <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
                  This item is temporarily unavailable because one or more ingredients
                  are out of stock.
                </div>
              ) : null}

              <div className="mb-8">
                <h3 className="mb-4 text-xl font-semibold">Ingredients</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {ingredients.map((ingredient, index) => (
                    <motion.div
                      key={ingredient}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.35 + index * 0.04 }}
                      className="flex items-center gap-2 text-muted-foreground"
                    >
                      <Check size={16} className="shrink-0 text-accent" />
                      <span>{ingredient}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="mb-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-card p-4">
                  <p className="mb-1 text-sm text-muted-foreground">Calories</p>
                  <p className="font-semibold">{item.calories}</p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-4">
                  <p className="mb-1 text-sm text-muted-foreground">Allergens</p>
                  <p className="text-sm font-semibold">{item.allergens}</p>
                </div>
              </div>

              {toppingGroups.length > 0 ? (
                <div className="mb-8 rounded-3xl border border-border bg-secondary p-6">
                  <h3 className="mb-2 text-sm uppercase tracking-wider text-muted-foreground">
                    Add toppings
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Optional — select any toppings to add to your drink.
                  </p>
                  <div className="space-y-5">
                    {toppingGroups.map((group) => (
                      <div key={group.category}>
                        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {group.title}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {group.items.map((topping) => {
                            const selected = selectedToppingIds.includes(topping.id);
                            const priceCents = Math.round(Number(topping.price) * 100);

                            return (
                              <button
                                key={topping.id}
                                type="button"
                                onClick={() => toggleTopping(topping.id)}
                                aria-pressed={selected}
                                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                                  selected
                                    ? "border-accent bg-accent text-accent-foreground"
                                    : "border-border bg-background hover:border-accent/50"
                                }`}
                              >
                                {topping.name}
                                {priceCents > 0 ? ` · +${formatMoney(priceCents)}` : ""}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-auto flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  className="btn-accent h-12 flex-1"
                  disabled={adding || selectedQuantity < 1}
                  onClick={() => void handleAddToCart()}
                >
                  {adding ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ShoppingCart className="mr-2 h-4 w-4" />
                  )}
                  {hasAvailableSize
                    ? `Add to cart · ${formatMoney(totalUnitPriceCents)}`
                    : "Unavailable"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 flex-1 rounded-full"
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
