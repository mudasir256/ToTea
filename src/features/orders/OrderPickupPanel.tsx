import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { Order } from "@/types/database";
import { formatDateTime, formatMoney } from "@/lib/money";
import { resolveMenuCardImage } from "@/lib/menuImages";
import {
  STORE_PICKUP,
  formatCountdown,
  pickupCodeFromOrderNumber,
  pickupReadyAt,
  PICKUP_PREP_MS,
  PICKUP_PREP_MINUTES,
} from "@/features/orders/pickupTimer";

const RING_RADIUS = 76;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function formatOrderMoney(amount: number) {
  return formatMoney(Math.round(Number(amount) * 100));
}

function usePickupCountdown(createdAt: string) {
  const readyAtMs = useMemo(() => pickupReadyAt(createdAt), [createdAt]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const remainingMs = Math.max(0, readyAtMs - now);
  const remainingSec = Math.ceil(remainingMs / 1000);
  const isReady = remainingSec <= 0;
  const progress = isReady ? 0 : remainingMs / PICKUP_PREP_MS;

  return { remainingSec, isReady, progress };
}

type HistoryOrder = Pick<Order, "id" | "order_number" | "items" | "total" | "created_at" | "order_status">;

type Props = {
  order: Order;
  historyOrders?: HistoryOrder[];
};

export function OrderPickupPanel({ order, historyOrders = [] }: Props) {
  const { remainingSec, isReady, progress } = usePickupCountdown(order.created_at);
  const pickupCode = pickupCodeFromOrderNumber(order.order_number);
  const { time } = formatDateTime(order.created_at);
  const customerName = order.customer_details?.name?.trim() || "Guest";
  const firstName = customerName.split(/\s+/)[0] || customerName;
  const cancelled = order.order_status === "cancelled" || order.order_status === "refunded";
  const showReady = !cancelled && (isReady || order.order_status === "ready" || order.order_status === "completed");

  const strokeDashoffset = RING_CIRCUMFERENCE * progress;

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)]">
      <article className="overflow-hidden rounded-[20px] border border-[#E6DBC4] bg-[#FFFDF8] shadow-[0_1px_2px_rgba(42,29,20,0.04),0_12px_32px_rgba(42,29,20,0.06)]">
        <div className="flex items-center justify-between px-7 pt-5">
          <div className="font-serif text-[18px] font-semibold tracking-[0.02em] text-[#2A1D14]">
            ToTea
          </div>
          <div className="font-mono text-[11px] tracking-[0.06em] text-[#8C7C64]">
            {order.order_number}
          </div>
        </div>

        {cancelled ? (
          <div className="px-7 py-10 text-center">
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#8C7C64]">Order status</p>
            <p className="mt-3 font-serif text-2xl font-semibold text-[#2A1D14]">
              {order.order_status === "refunded" ? "Refunded" : "Cancelled"}
            </p>
            <p className="mt-2 text-sm text-[#8C7C64]">This order is no longer being prepared.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center px-4 pb-2 pt-5">
              <p className="mb-3.5 text-[11px] uppercase tracking-[0.14em] text-[#8C7C64]">
                {showReady ? "Order ready" : "Steeping your order"}
              </p>
              <div className="relative size-[168px]">
                <svg viewBox="0 0 168 168" className="size-full -rotate-90">
                  <circle
                    cx="84"
                    cy="84"
                    r={RING_RADIUS}
                    fill="none"
                    stroke="#E6DBC4"
                    strokeWidth="8"
                  />
                  <circle
                    cx="84"
                    cy="84"
                    r={RING_RADIUS}
                    fill="none"
                    stroke={showReady ? "#5C6E4E" : "#C8873D"}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={RING_CIRCUMFERENCE}
                    strokeDashoffset={showReady ? 0 : strokeDashoffset}
                    className="transition-[stroke-dashoffset,stroke] duration-1000 ease-linear"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="font-mono text-[30px] font-bold tracking-[-0.01em] text-[#2A1D14]">
                    {showReady ? "Ready" : formatCountdown(remainingSec)}
                  </div>
                  <div className="mt-0.5 text-[11px] text-[#8C7C64]">
                    {showReady ? "for pickup" : "until ready"}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 px-7 pb-1 pt-5">
              <Step label="Confirmed" state="done" />
              <Connector done />
              <Step label="Preparing" state={showReady ? "done" : "active"} />
              <Connector done={showReady} />
              <Step label="Ready" state={showReady ? "active" : "idle"} />
            </div>

            {showReady ? (
              <div className="mx-6 mt-5 rounded-[14px] bg-[#5C6E4E] px-4 py-4 text-center text-white">
                <p className="text-[10.5px] uppercase tracking-[0.12em] text-white/75">
                  Come to the counter
                </p>
                <p className="mt-1 font-serif text-[1.35rem] font-semibold leading-tight">
                  Your order is ready for pickup
                </p>
                <p className="mt-1.5 text-[13px] text-white/85">
                  Show code <span className="font-mono font-bold">{pickupCode}</span> at the shop.
                </p>
              </div>
            ) : (
              <p className="mx-6 mt-5 text-center text-[13px] leading-relaxed text-[#8C7C64]">
                We’re preparing your drinks — about {PICKUP_PREP_MINUTES} minutes from when you
                ordered. We’ll tell you when it’s time to come pick up.
              </p>
            )}

            <div className="mx-6 mt-4 flex items-center justify-between gap-3 rounded-[14px] bg-[#E4E9DB] px-[18px] py-4">
              <div>
                <div className="text-[10.5px] uppercase tracking-[0.12em] text-[#8C7C64]">
                  Pickup code
                </div>
                <div className="font-mono text-[20px] font-bold tracking-[0.03em] text-[#5C6E4E]">
                  {pickupCode}
                </div>
              </div>
              <div className="text-right text-[12px] leading-[1.4] text-[#6B4A2E]">
                {STORE_PICKUP.addressLine1}
                <br />
                {STORE_PICKUP.shortCity}
                <br />
                <a
                  href={STORE_PICKUP.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#5C6E4E] hover:underline"
                >
                  Get directions →
                </a>
              </div>
            </div>
          </>
        )}

        <div className="px-7 pb-1 pt-6">
          <h2 className="mb-3 font-serif text-[15px] font-medium text-[#6B4A2E]">Items</h2>
          <ul>
            {order.items.map((item, index) => {
              const imageSrc = resolveMenuCardImage(item.name, item.image_url || null);
              return (
                <li
                  key={`${item.menu_item_id}-${index}`}
                  className="flex items-center gap-3 border-b border-[#E6DBC4] py-3 text-[13.5px] last:border-b-0"
                >
                  <div
                    className="size-12 shrink-0 rounded-xl bg-cover bg-center ring-1 ring-[#E6DBC4]"
                    style={{
                      backgroundImage: imageSrc
                        ? `url(${imageSrc})`
                        : "linear-gradient(160deg,#c4b49a,#8a7358)",
                    }}
                    role="img"
                    aria-label={item.name}
                  />
                  <span className="min-w-0 flex-1 font-medium text-[#2A1D14]">
                    {item.name}{" "}
                    <span className="font-normal text-[#8C7C64]">×{item.quantity}</span>
                    {(item.sweetness || item.ice || item.size) && (
                      <span className="mt-0.5 block text-[11.5px] font-normal text-[#8C7C64]">
                        {[item.size, item.sweetness, item.ice].filter(Boolean).join(" · ")}
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 self-start pt-0.5 font-mono text-[12.5px] text-[#6B4A2E]">
                    {formatOrderMoney(item.line_total)}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="mt-2 space-y-1.5 border-t border-[#E6DBC4] pt-3 text-[13px]">
            <div className="flex justify-between text-[#8C7C64]">
              <span>Subtotal</span>
              <span className="font-mono tabular-nums text-[#6B4A2E]">
                {formatOrderMoney(order.subtotal ?? order.total)}
              </span>
            </div>
            <div className="flex justify-between text-[#8C7C64]">
              <span>Tax</span>
              <span className="font-mono tabular-nums text-[#6B4A2E]">
                {formatOrderMoney(order.tax ?? 0)}
              </span>
            </div>
            <div className="flex justify-between text-[#8C7C64]">
              <span>Tip</span>
              <span className="font-mono tabular-nums text-[#6B4A2E]">
                {formatOrderMoney(order.tip ?? 0)}
              </span>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-[#2A1D14] pt-3 font-serif text-base font-semibold text-[#2A1D14]">
            <span>Paid total</span>
            <span>{formatOrderMoney(order.total)}</span>
          </div>
        </div>

        <div className="mx-6 mb-5 mt-5 rounded-xl border border-dashed border-[#E6DBC4] px-4 py-3 text-center text-[12px] text-[#8C7C64]">
          Something wrong with your order?{" "}
          <a href={STORE_PICKUP.phoneHref} className="font-semibold text-[#6B4A2E] hover:underline">
            Call the shop
          </a>
        </div>

        <div className="px-7 pb-6 text-center text-[11px] tracking-[0.02em] text-[#8C7C64]">
          Order for <strong className="text-[#6B4A2E]">{firstName}</strong>
          {order.payment_status === "paid" ? " · Paid" : ""} · Placed {time}
        </div>
      </article>

      <aside className="flex flex-col gap-5">
        <section className="rounded-[20px] border border-[#E6DBC4] bg-[#FFFDF8] p-6 shadow-[0_1px_2px_rgba(42,29,20,0.04),0_12px_32px_rgba(42,29,20,0.06)]">
          <h2 className="font-serif text-base font-semibold text-[#6B4A2E]">Order history</h2>
          <p className="mb-4 mt-1 text-[12px] text-[#8C7C64]">
            Your last few pickups at this location
          </p>

          {historyOrders.length === 0 ? (
            <p className="py-4 text-center text-[13px] text-[#8C7C64]">No earlier orders yet.</p>
          ) : (
            <ul>
              {historyOrders.map((entry) => {
                const { date } = formatDateTime(entry.created_at);
                const names = entry.items.map((item) =>
                  item.quantity > 1 ? `${item.name} ×${item.quantity}` : item.name,
                );
                const summary =
                  names.length > 2
                    ? `${names.slice(0, 2).join(", ")} +${names.length - 2}`
                    : names.join(", ");
                return (
                  <li
                    key={entry.id}
                    className="flex items-center justify-between gap-3 border-b border-[#E6DBC4] py-3.5 last:border-b-0"
                  >
                    <div className="min-w-0">
                      <div className="text-[11px] tracking-[0.02em] text-[#8C7C64]">{date}</div>
                      <div className="truncate text-[13px] font-medium text-[#2A1D14]">
                        {summary || entry.order_number}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="font-mono text-[12.5px] text-[#6B4A2E]">
                        {formatOrderMoney(entry.total)}
                      </span>
                      <Link
                        to="/menu"
                        className="rounded-full border border-[#E6DBC4] px-3 py-1 text-[11.5px] font-semibold text-[#6B4A2E] transition-colors hover:border-[#5C6E4E] hover:bg-[#E4E9DB]"
                      >
                        Reorder
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <Link
            to="/account/orders"
            className="mt-3.5 block text-center text-[12px] font-semibold text-[#5C6E4E] hover:underline"
          >
            See all orders →
          </Link>
        </section>

        <section className="rounded-[20px] border border-[#E6DBC4] bg-[#FFFDF8] p-6 shadow-[0_1px_2px_rgba(42,29,20,0.04),0_12px_32px_rgba(42,29,20,0.06)]">
          <h2 className="mb-4 font-serif text-base font-semibold text-[#6B4A2E]">Store info</h2>
          <div className="flex justify-between gap-3 py-2 text-[12.5px]">
            <span className="text-[#8C7C64]">Today&apos;s hours</span>
            <span className="text-right font-medium text-[#2A1D14]">{STORE_PICKUP.hoursToday}</span>
          </div>
          <div className="my-1.5 h-px bg-[#E6DBC4]" />
          <div className="flex justify-between gap-3 py-2 text-[12.5px]">
            <span className="text-[#8C7C64]">Address</span>
            <span className="text-right font-medium text-[#2A1D14]">
              {STORE_PICKUP.addressLine1},
              <br />
              {STORE_PICKUP.cityLine}
            </span>
          </div>
          <a
            href={STORE_PICKUP.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3.5 block rounded-[10px] bg-[#2A1D14] py-2.5 text-center text-[12.5px] font-semibold text-[#FFFDF8] transition-opacity hover:opacity-90"
          >
            Get directions
          </a>
        </section>
      </aside>
    </div>
  );
}

function Step({
  label,
  state,
}: {
  label: string;
  state: "idle" | "active" | "done";
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`size-[7px] rounded-full ${
          state === "done"
            ? "bg-[#5C6E4E]"
            : state === "active"
              ? "bg-[#C8873D] shadow-[0_0_0_4px_rgba(200,135,61,0.18)]"
              : "bg-[#E6DBC4]"
        }`}
      />
      <span
        className={`text-[11.5px] font-semibold tracking-[0.01em] ${
          state === "idle" ? "text-[#8C7C64]" : "text-[#2A1D14]"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function Connector({ done = false }: { done?: boolean }) {
  return <span className={`mx-0.5 h-px w-5 ${done ? "bg-[#5C6E4E]" : "bg-[#E6DBC4]"}`} />;
}
