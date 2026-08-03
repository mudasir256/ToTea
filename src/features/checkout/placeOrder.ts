import type { LocalCartItem } from "@/features/cart/CartProvider";
import { clearCheckoutIdempotencyKey, getOrCreateCheckoutIdempotencyKey } from "@/lib/checkout";
import { getSupabase } from "@/lib/supabase";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const STORE_ADDRESS = {
  address_line_1: "9534 Liberia Ave",
  address_line_2: "",
  city: "Manassas",
  state: "VA",
  postal_code: "20110",
  country: "US",
};

type Tokenize = (details?: unknown) => Promise<{
  status: string;
  token?: string;
  errors?: Array<{ message: string }>;
}>;

type PlaceOrderInput = {
  items: LocalCartItem[];
  totalCents: number;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  tokenize: Tokenize;
  saveContact?: boolean;
  marketingOptIn?: boolean;
  orderType?: "asap" | "later";
  promoCode?: string;
};

export async function placeSquareOrder(input: PlaceOrderInput): Promise<string> {
  if (input.items.length === 0) {
    throw new Error("Your cart is empty.");
  }
  if (input.items.some((item) => item.stock_quantity < item.quantity)) {
    throw new Error("One or more items are out of stock. Update your cart and try again.");
  }

  const checkoutItems = input.items.map((item) => ({
    menuItemId: item.product_id,
    quantity: item.quantity,
    size: item.selected_options.size,
    toppingIds: (item.selected_options.toppings ?? []).map((topping) => topping.id),
    sweetness: item.selected_options.sweetness,
    ice: item.selected_options.ice,
    milk: item.selected_options.milk,
  }));

  if (checkoutItems.some((item) => !UUID_PATTERN.test(item.menuItemId))) {
    throw new Error(
      "One or more cart items came from the old menu. Remove them and add them again.",
    );
  }

  const tokenResult = await input.tokenize({
    amount: (input.totalCents / 100).toFixed(2),
    currencyCode: "USD",
    intent: "CHARGE",
    customerInitiated: true,
    sellerKeyedIn: false,
    billingContact: {
      givenName: input.firstName,
      familyName: input.lastName,
      email: input.email,
      phone: input.contactNumber,
      addressLines: [STORE_ADDRESS.address_line_1],
      city: STORE_ADDRESS.city,
      state: STORE_ADDRESS.state,
      postalCode: STORE_ADDRESS.postal_code,
      countryCode: "US",
    },
  });

  if (tokenResult.status !== "OK" || !tokenResult.token) {
    throw new Error(
      tokenResult.errors?.map((e) => e.message).join(", ") || "Card tokenization failed",
    );
  }

  const idempotencyKey = getOrCreateCheckoutIdempotencyKey();
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase is not configured");

  try {
    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: {
        idempotencyKey,
        sourceId: tokenResult.token,
        customerName: `${input.firstName} ${input.lastName}`.trim(),
        customerEmail: input.email,
        contactNumber: input.contactNumber,
        items: checkoutItems,
        shippingAddress: STORE_ADDRESS,
        saveContact: input.saveContact ?? true,
        marketingOptIn: input.marketingOptIn,
        orderType: input.orderType,
        promoCode: input.promoCode || undefined,
      },
    });

    if (error) {
      let message = error.message;
      const response = (error as { context?: Response }).context;
      if (response) {
        try {
          const payload = (await response.clone().json()) as { error?: string };
          if (payload.error) message = payload.error;
        } catch {
          // keep client error
        }
      }
      throw new Error(message);
    }
    if (data?.error) throw new Error(data.error as string);

    const orderId = data?.orderId ?? data?.order?.id;
    if (!orderId) throw new Error("Checkout did not return an order id");

    clearCheckoutIdempotencyKey();
    return orderId as string;
  } catch (error) {
    clearCheckoutIdempotencyKey();
    throw error;
  }
}
