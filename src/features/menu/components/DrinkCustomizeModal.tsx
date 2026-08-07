import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Check, Loader2, Minus, Plus, X } from "lucide-react";
import { formatMoney } from "@/lib/money";
import { availableQuantity } from "@/lib/menuStock";
import { resolveMenuCardImage } from "@/lib/menuImages";
import { badgeFor } from "@/features/menu/badges";
import { useDrinkCustomization } from "@/features/menu/useDrinkCustomization";
import type {
  MenuItemOptionSettings,
  MenuItemWithVariants,
  MenuOptionLevel,
  MenuStockAvailability,
  MenuTopping,
} from "@/types/database";

const MAX_QUANTITY = 25;

type Props = {
  item: MenuItemWithVariants | null;
  toppings: MenuTopping[];
  stock: MenuStockAvailability[];
  optionLevels: MenuOptionLevel[];
  itemSettings?: MenuItemOptionSettings | null;
  allowedToppingIds?: string[] | null;
  /** Prefill + replace mode when editing a cart line. */
  initialSelection?: {
    size?: string;
    sweetness?: string;
    ice?: string;
    toppingIds?: string[];
    quantity?: number;
  } | null;
  replaceCartItemId?: string | null;
  onClose: () => void;
};

function OptionPill({
  selected,
  disabled,
  onSelect,
  children,
}: {
  selected: boolean;
  disabled?: boolean;
  onSelect: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      aria-pressed={selected}
      className={`rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-200 ${
        selected
          ? "bg-accent text-white"
          : disabled
            ? "cursor-not-allowed bg-secondary/50 text-muted-foreground/50 line-through"
            : "bg-[#f3ebe1] text-foreground hover:bg-[#ebe0d2]"
      }`}
    >
      {children}
    </button>
  );
}

function OptionGroup({
  label,
  hint,
  description,
  children,
  list = false,
}: {
  label: string;
  hint?: string;
  description?: string;
  children: React.ReactNode;
  list?: boolean;
}) {
  return (
    <div className="border-b border-border py-5 last:border-b-0 last:pb-0 first:pt-0">
      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-sans text-[14px] font-semibold text-foreground">{label}</h3>
        {hint ? (
          <span className="text-[11.5px] text-muted-foreground">{hint}</span>
        ) : null}
      </div>
      {description ? (
        <p className="mb-3 text-[12.5px] text-muted-foreground">{description}</p>
      ) : (
        <div className="mb-3.5" />
      )}
      {list ? (
        <ul className="divide-y divide-border border-t border-border">{children}</ul>
      ) : (
        <div className="flex flex-wrap gap-2.5">{children}</div>
      )}
    </div>
  );
}

function ToppingRow({
  selected,
  disabled,
  name,
  included,
  priceLabel,
  onSelect,
}: {
  selected: boolean;
  disabled?: boolean;
  name: string;
  included?: boolean;
  priceLabel: string;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        disabled={disabled && !selected}
        onClick={onSelect}
        aria-pressed={selected}
        className="flex w-full items-center gap-3 py-3.5 text-left disabled:cursor-not-allowed disabled:opacity-45"
      >
        <span
          aria-hidden
          className={`order-first flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[4px] border transition-colors ${
            selected
              ? "border-accent bg-accent text-white"
              : "border-border bg-white text-transparent"
          }`}
        >
          <Check size={11} strokeWidth={3} />
        </span>
        <span className="min-w-0 flex-1 text-[14px] text-foreground">{name}</span>
        {included ? (
          <span className="shrink-0 rounded-full bg-[#5a7a52] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            Included
          </span>
        ) : (
          <span
            className={`shrink-0 text-[13px] font-medium tabular-nums ${
              priceLabel === "Free" ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {priceLabel}
          </span>
        )}
      </button>
    </li>
  );
}

export function DrinkCustomizeModal({
  item,
  toppings,
  stock,
  optionLevels,
  itemSettings = null,
  allowedToppingIds = null,
  initialSelection = null,
  replaceCartItemId = null,
  onClose,
}: Props) {
  const editing = Boolean(replaceCartItemId);
  const {
    stock: liveStock,
    sizes,
    sugarLevels,
    iceLevels,
    defaultSweetness,
    defaultIce,
    selectedSize,
    setSelectedSize,
    selectedSweetness,
    setSelectedSweetness,
    selectedIce,
    setSelectedIce,
    selectedCreamIds,
    toggleCream,
    clearCream,
    includedCreamToppingId,
    includedCreamTopping,
    includedStandardTopping,
    maxCreamToppings,
    selectedStandardIds,
    toggleStandardTopping,
    creamToppings,
    standardToppings,
    includesFreeTopping,
    freeStandardToppingId,
    maxStandardToppings,
    quantity,
    setQuantity,
    adding,
    totalUnitPriceCents,
    selectedQuantity,
    hasAvailableSize,
    priceForSize,
    addToCart,
  } = useDrinkCustomization(
    item,
    toppings,
    stock,
    optionLevels,
    itemSettings,
    allowedToppingIds,
    { initialSelection, replaceCartItemId },
  );

  const quantityLimit = Math.min(MAX_QUANTITY, Math.max(0, selectedQuantity));
  const runningTotalCents = totalUnitPriceCents * quantity;
  const atStandardLimit = selectedStandardIds.length >= maxStandardToppings;
  const badge = item ? badgeFor(item) : null;

  const handleAdd = async () => {
    if (await addToCart()) onClose();
  };

  return (
    <DialogPrimitive.Root
      open={item !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[#2a1f16]/55 backdrop-blur-[2px] data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-white duration-300 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom-4 data-[state=open]:slide-in-from-bottom-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:h-[min(42rem,92vh)] sm:w-[min(58rem,calc(100vw-2rem))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[28px] sm:border sm:border-border sm:shadow-[0_24px_80px_rgba(74,54,38,0.18)]">
          {item ? (
            <>
              <div className="flex min-h-0 flex-1 flex-col sm:flex-row">
                <div className="relative shrink-0 sm:w-[42%]">
                  <img
                    src={resolveMenuCardImage(item.name, item.image_url)}
                    alt={item.name}
                    width={480}
                    height={360}
                    decoding="async"
                    fetchPriority="high"
                    className={`h-44 w-full object-cover sm:h-full sm:rounded-l-[28px] ${
                      hasAvailableSize ? "" : "saturate-[0.55] brightness-[0.9]"
                    }`}
                  />
                  {badge ? (
                    <span className="absolute bottom-3 left-4 rounded-md bg-white px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.04em] text-accent-hover shadow-[0_1px_3px_rgba(42,31,22,0.18)]">
                      {badge}
                    </span>
                  ) : null}
                  <DialogPrimitive.Close
                    aria-label="Close"
                    className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-foreground shadow-sm transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <X size={16} strokeWidth={1.75} />
                  </DialogPrimitive.Close>
                </div>

                <div
                  data-lenis-prevent
                  className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-8 sm:py-7"
                >
                  <DialogPrimitive.Title className="font-serif text-[1.7rem] font-semibold leading-[1.15] tracking-[-0.02em] text-foreground">
                    {item.name}
                  </DialogPrimitive.Title>

                  <DialogPrimitive.Description className="mt-2 text-[14px] leading-[1.6] text-muted-foreground">
                    {item.description}
                  </DialogPrimitive.Description>

                  <p className="mt-3 text-[18px] font-semibold tabular-nums text-accent-hover">
                    {formatMoney(totalUnitPriceCents)}
                  </p>

                  {!hasAvailableSize ? (
                    <p className="mt-4 border-l-2 border-destructive/50 pl-4 text-[13.5px] leading-relaxed text-destructive">
                      This drink is temporarily unavailable because one or more ingredients
                      are out of stock.
                    </p>
                  ) : null}

                  <div className="mt-6 space-y-0">
                    {sizes.length > 1 ? (
                      <OptionGroup label="Size">
                        {sizes.map((size) => (
                          <OptionPill
                            key={size}
                            selected={selectedSize === size}
                            disabled={availableQuantity(liveStock, item.id, size) < 1}
                            onSelect={() => setSelectedSize(size)}
                          >
                            {size}
                            <span className="ml-1.5 tabular-nums opacity-80">
                              {formatMoney(priceForSize(size))}
                            </span>
                          </OptionPill>
                        ))}
                      </OptionGroup>
                    ) : null}

                    <OptionGroup label="Sugar Level">
                      {sugarLevels.map((level) => (
                        <OptionPill
                          key={level}
                          selected={selectedSweetness === level}
                          onSelect={() => setSelectedSweetness(level)}
                        >
                          {level}
                          {level === defaultSweetness ? " ★" : ""}
                        </OptionPill>
                      ))}
                    </OptionGroup>

                    <OptionGroup label="Ice Level">
                      {iceLevels.map((level) => (
                        <OptionPill
                          key={level}
                          selected={selectedIce === level}
                          onSelect={() => setSelectedIce(level)}
                        >
                          {level}
                          {level === defaultIce ? " ★" : ""}
                        </OptionPill>
                      ))}
                    </OptionGroup>

                    {creamToppings.length > 0 ? (
                      <OptionGroup
                        list
                        label="Cream tops"
                        hint={`Choose up to ${maxCreamToppings}`}
                        description={
                          includedCreamTopping
                            ? `${includedCreamTopping.name} comes with this drink — add one more, swap it, or remove it if you'd rather.`
                            : "Priced per item — optional cream layer on top."
                        }
                      >
                        <ToppingRow
                          selected={selectedCreamIds.length === 0}
                          name="None"
                          priceLabel="Free"
                          onSelect={clearCream}
                        />
                        {creamToppings.map((topping) => {
                          const included = topping.id === includedCreamToppingId;
                          const selected = selectedCreamIds.includes(topping.id);
                          const atCreamLimit =
                            selectedCreamIds.length >= maxCreamToppings && !selected;
                          const priceCents = Math.round(Number(topping.price) * 100);
                          return (
                            <ToppingRow
                              key={topping.id}
                              selected={selected}
                              disabled={atCreamLimit}
                              name={topping.name}
                              included={included}
                              priceLabel={
                                included
                                  ? "Included"
                                  : priceCents > 0
                                    ? `+${formatMoney(priceCents)}`
                                    : "Free"
                              }
                              onSelect={() => toggleCream(topping.id)}
                            />
                          );
                        })}
                      </OptionGroup>
                    ) : null}

                    {standardToppings.length > 0 ? (
                      <OptionGroup
                        list
                        label={
                          includesFreeTopping
                            ? "Toppings · max 2 additional"
                            : "Toppings · max 2"
                        }
                        description={
                          includedStandardTopping
                            ? `${includedStandardTopping.name} comes with this drink — add more, swap it, or remove it if you'd rather.`
                            : includesFreeTopping
                              ? "1 topping included free with this drink"
                              : "No included topping for this category — all add-ons are priced"
                        }
                      >
                        {standardToppings.map((topping) => {
                          const selected = selectedStandardIds.includes(topping.id);
                          const included = freeStandardToppingId === topping.id;
                          const priceCents = Math.round(Number(topping.price) * 100);
                          return (
                            <ToppingRow
                              key={topping.id}
                              selected={selected}
                              disabled={atStandardLimit && !selected}
                              name={topping.name}
                              included={included}
                              priceLabel={
                                priceCents > 0 ? `+${formatMoney(priceCents)}` : "Free"
                              }
                              onSelect={() => toggleStandardTopping(topping.id)}
                            />
                          );
                        })}
                      </OptionGroup>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-4 border-t border-border bg-white px-5 py-4 sm:rounded-b-[28px] sm:px-8">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity(quantity - 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-accent/60 hover:text-accent disabled:opacity-35"
                  >
                    <Minus size={14} strokeWidth={1.75} />
                  </button>
                  <span className="w-5 text-center text-[15px] font-medium tabular-nums text-foreground">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    disabled={quantity >= quantityLimit}
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-accent/60 hover:text-accent disabled:opacity-35"
                  >
                    <Plus size={14} strokeWidth={1.75} />
                  </button>
                </div>

                <button
                  type="button"
                  disabled={adding || quantityLimit < 1}
                  onClick={() => void handleAdd()}
                  className="ml-auto inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-8 text-[14.5px] font-semibold text-white transition-colors duration-200 hover:bg-accent-hover active:bg-accent-active disabled:cursor-not-allowed disabled:opacity-45 max-sm:flex-1"
                >
                  {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {quantityLimit < 1
                    ? "Unavailable"
                    : editing
                      ? `Update · ${formatMoney(runningTotalCents)}`
                      : `Add to cart · ${formatMoney(runningTotalCents)}`}
                </button>
              </div>
            </>
          ) : null}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
