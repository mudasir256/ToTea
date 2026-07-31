import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Check, Loader2, Minus, Plus, X } from "lucide-react";
import { formatMoney } from "@/lib/money";
import { availableQuantity } from "@/lib/menuStock";
import { useDrinkCustomization } from "@/features/menu/useDrinkCustomization";
import type { MenuItemWithVariants, MenuStockAvailability, MenuTopping } from "@/types/database";

const MAX_QUANTITY = 25;

type Props = {
  item: MenuItemWithVariants | null;
  toppings: MenuTopping[];
  stock: MenuStockAvailability[];
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
      className={`rounded-full border px-4 py-2.5 text-[13.5px] transition-colors duration-200 ${
        selected
          ? "border-accent bg-accent text-accent-foreground"
          : disabled
            ? "cursor-not-allowed border-border/60 bg-transparent text-muted-foreground/60 line-through"
            : "border-border bg-secondary/60 text-foreground hover:border-accent/50"
      }`}
    >
      {children}
    </button>
  );
}

function OptionGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-border pt-6 first:border-t-0 first:pt-0">
      <h3 className="font-sans text-[14.5px] font-semibold text-foreground">{label}</h3>
      <div className="mt-3 flex flex-wrap gap-2.5">{children}</div>
    </div>
  );
}

export function DrinkCustomizeModal({ item, toppings, stock, onClose }: Props) {
  const {
    stock: liveStock,
    sizes,
    selectedSize,
    setSelectedSize,
    selectedToppingIds,
    toggleTopping,
    toppingGroups,
    quantity,
    setQuantity,
    adding,
    totalUnitPriceCents,
    selectedQuantity,
    hasAvailableSize,
    priceForSize,
    addToCart,
  } = useDrinkCustomization(item, toppings, stock);

  const quantityLimit = Math.min(MAX_QUANTITY, Math.max(0, selectedQuantity));
  const runningTotalCents = totalUnitPriceCents * quantity;

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
        <DialogPrimitive.Content className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-card duration-300 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom-4 data-[state=open]:slide-in-from-bottom-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:h-[min(42rem,90vh)] sm:w-[min(56rem,calc(100vw-3rem))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl sm:border sm:border-border">
          {item ? (
            <>
              <div className="flex min-h-0 flex-1 flex-col sm:flex-row">
                <div className="relative shrink-0 sm:w-[38%]">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className={`h-40 w-full object-cover sm:h-full ${
                      hasAvailableSize ? "" : "saturate-[0.55] brightness-[0.9]"
                    }`}
                  />
                  <DialogPrimitive.Close
                    aria-label="Close"
                    className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-card/95 text-foreground transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <X size={16} strokeWidth={1.75} />
                  </DialogPrimitive.Close>
                </div>

                {/* Lenis smooth-scrolls the window and swallows wheel events; this opts out. */}
                <div
                  data-lenis-prevent
                  className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-7 sm:px-8"
                >
                  <DialogPrimitive.Title className="font-serif text-[1.65rem] font-semibold leading-[1.15] tracking-[-0.02em] text-foreground">
                    {item.name}
                  </DialogPrimitive.Title>

                  <DialogPrimitive.Description className="mt-2 text-[14px] leading-[1.6] text-muted-foreground">
                    {item.description}
                  </DialogPrimitive.Description>

                  <p className="mt-3 text-[17px] font-semibold tabular-nums text-accent">
                    {formatMoney(totalUnitPriceCents)}
                  </p>

                  <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">
                    <span>{item.calories}</span>
                    <span className="mx-2 text-border">·</span>
                    <span>{item.allergens}</span>
                  </p>

                  {!hasAvailableSize ? (
                    <p className="mt-4 border-l-2 border-destructive/50 pl-4 text-[13.5px] leading-relaxed text-destructive">
                      This drink is temporarily unavailable because one or more ingredients
                      are out of stock.
                    </p>
                  ) : null}

                  <div className="mt-7 space-y-6">
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
                            <span className="ml-2 tabular-nums opacity-75">
                              {formatMoney(priceForSize(size))}
                            </span>
                          </OptionPill>
                        ))}
                      </OptionGroup>
                    ) : null}

                    {toppingGroups.length > 0 ? (
                      <div className="border-t border-border pt-6">
                        <h3 className="font-sans text-[14.5px] font-semibold text-foreground">
                          Add toppings
                        </h3>
                        <p className="mt-0.5 text-[12.5px] text-muted-foreground">
                          Optional extras, prepared with your drink.
                        </p>

                        <div className="mt-4 space-y-6">
                          {toppingGroups.map((group) => (
                            <div key={group.category}>
                              <h4 className="mb-1 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                                {group.title}
                              </h4>
                              <ul className="divide-y divide-border">
                                {group.items.map((topping) => {
                                  const selected = selectedToppingIds.includes(topping.id);
                                  const priceCents = Math.round(Number(topping.price) * 100);

                                  return (
                                    <li key={topping.id}>
                                      <button
                                        type="button"
                                        onClick={() => toggleTopping(topping.id)}
                                        aria-pressed={selected}
                                        className="group flex w-full items-center gap-3 py-3 text-left"
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
                                          className={`min-w-0 flex-1 text-[14px] ${
                                            selected ? "text-foreground" : "text-foreground/80"
                                          }`}
                                        >
                                          {topping.name}
                                        </span>
                                        <span
                                          aria-hidden
                                          className="mx-2 hidden flex-1 border-b border-dotted border-border sm:block"
                                        />
                                        <span
                                          className={`shrink-0 text-[13px] tabular-nums ${
                                            selected ? "text-accent" : "text-muted-foreground"
                                          }`}
                                        >
                                          {priceCents > 0
                                            ? `+${formatMoney(priceCents)}`
                                            : "Free"}
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
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-4 border-t border-border bg-card px-6 py-4 sm:px-8">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity(quantity - 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-accent/60 hover:text-accent disabled:opacity-35 disabled:hover:border-border disabled:hover:text-foreground"
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
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-accent/60 hover:text-accent disabled:opacity-35 disabled:hover:border-border disabled:hover:text-foreground"
                  >
                    <Plus size={14} strokeWidth={1.75} />
                  </button>
                </div>

                <button
                  type="button"
                  disabled={adding || quantityLimit < 1}
                  onClick={() => void handleAdd()}
                  className="ml-auto inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-8 text-[14.5px] font-semibold text-accent-foreground transition-colors duration-200 hover:bg-accent-hover active:bg-accent-active disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-accent max-sm:flex-1"
                >
                  {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {quantityLimit < 1
                    ? "Unavailable"
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
