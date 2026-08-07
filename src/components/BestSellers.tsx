import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { MenuCardImage } from "@/components/MenuCardImage";
import { getSupabase } from "@/lib/supabase";
import { resolveMenuCardImage } from "@/lib/menuImages";
import { menuItemHasStock } from "@/lib/menuStock";
import type { MenuItemWithVariants, MenuStockAvailability } from "@/types/database";

type BestSellerItem = MenuItemWithVariants & {
  menu_categories?: { name: string } | { name: string }[] | null;
};

function categoryName(item: BestSellerItem) {
  const category = item.menu_categories;
  if (Array.isArray(category)) return category[0]?.name ?? "ToTea menu";
  return category?.name ?? "ToTea menu";
}

function menuPriceLabel(item: MenuItemWithVariants) {
  const prices = (item.menu_item_variants ?? [])
    .map((variant) => Number(variant.price))
    .filter((price) => Number.isFinite(price));
  const lowestPrice = prices.length > 0 ? Math.min(...prices) : Number(item.price);
  return `${prices.length > 1 ? "From " : ""}$${lowestPrice.toFixed(2)}`;
}

async function fetchBestsellers() {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Unavailable");

  const [itemResult, stockResult] = await Promise.all([
    supabase
      .from("menu_items")
      .select(
        "id, category_id, name, description, image_url, price, sizes, ingredients, calories, allergens, is_available, is_bestseller, sort_order, menu_categories(name), menu_item_variants(id, size, price, sort_order)",
      )
      .eq("is_available", true)
      .eq("is_bestseller", true)
      .order("sort_order", { ascending: true })
      .limit(6),
    supabase.rpc("get_public_menu_stock", { p_menu_item_id: null }),
  ]);

  if (itemResult.error) throw itemResult.error;
  if (stockResult.error) throw stockResult.error;

  return {
    items: (itemResult.data ?? []) as BestSellerItem[],
    stock: (stockResult.data ?? []) as MenuStockAvailability[],
  };
}

export const BestSellers = () => {
  const { data, isPending } = useQuery({
    queryKey: ["bestsellers"],
    queryFn: fetchBestsellers,
    staleTime: 5 * 60_000,
  });

  const items = data?.items ?? [];
  const stock = data?.stock ?? [];

  if (!isPending && items.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1100px] px-5 py-16 md:px-8 md:py-[72px]">
      <div className="mb-8 max-w-xl md:mb-10">
        <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-hover">
          Customer favorites
        </div>
        <h2 className="font-serif text-[26px] font-semibold leading-[1.2] text-foreground md:text-[28px]">
          Bestsellers
        </h2>
        <p className="mt-2.5 max-w-[420px] text-[14.5px] leading-[1.7] text-foreground/85">
          The drinks our guests keep coming back for — curated from the menu.
        </p>
      </div>

      {isPending ? (
        <div className="flex min-h-48 items-center justify-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading bestsellers…</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => {
            const inStock = menuItemHasStock(stock, item.id);
            return (
              <Link
                key={item.id}
                to={`/product/${encodeURIComponent(item.name)}`}
                aria-disabled={!inStock}
                onClick={(event) => {
                  if (!inStock) event.preventDefault();
                }}
                className={`group flex flex-col overflow-hidden rounded-[14px] border border-border bg-white transition-[box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(74,54,38,0.1)] ${
                  inStock ? "" : "cursor-not-allowed opacity-80"
                }`}
              >
                <div className="relative">
                  <MenuCardImage
                    src={resolveMenuCardImage(item.name, item.image_url)}
                    alt={item.name}
                    priority={index < 3}
                    imgClassName={inStock ? "" : "saturate-[0.5] brightness-[0.92]"}
                  />
                  <span className="absolute left-2.5 top-2.5 z-10 whitespace-nowrap rounded-md bg-white px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.04em] text-accent-hover shadow-[0_1px_3px_rgba(42,31,22,0.18)]">
                    {inStock ? "Bestseller" : "Sold out"}
                  </span>
                </div>
                <div className="px-[15px] py-[13px]">
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                    {categoryName(item)}
                  </div>
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <h3 className="text-[14px] font-semibold leading-[1.3] text-foreground">
                      {item.name}
                    </h3>
                    <span className="shrink-0 text-[13.5px] font-semibold tabular-nums text-accent-hover">
                      {menuPriceLabel(item)}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-[12px] leading-[1.55] text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <div className="mt-8">
        <Link
          to="/menu"
          className="inline-flex items-center gap-3 text-[13px] font-bold uppercase tracking-[0.04em] text-foreground"
        >
          <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-accent text-white">
            →
          </span>
          Browse the full menu
        </Link>
      </div>
    </section>
  );
};
