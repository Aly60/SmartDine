"use client";

import { ArrowRight, Bike, Clock, ShoppingBag, UtensilsCrossed } from "lucide-react";
import { useEffect, useState } from "react";
import type { KitchenOrder, OrderStatus, OrderType } from "@/data/orders";
import { PageHeader } from "@/components/app-shell";
import { Badge, Button } from "@/components/ui";
import { useRestaurant } from "@/store/restaurant-store";
import { cn } from "@/lib/utils";

const columns: { status: OrderStatus; title: string; accent: string; dot: string; action: string }[] = [
  { status: "new", title: "New", accent: "border-t-sky-500", dot: "bg-sky-500", action: "Start cooking" },
  { status: "preparing", title: "Preparing", accent: "border-t-amber-500", dot: "bg-amber-500", action: "Mark ready" },
  { status: "ready", title: "Ready to serve", accent: "border-t-emerald-500", dot: "bg-emerald-500", action: "Served" },
];

const typeIcon: Record<OrderType, typeof UtensilsCrossed> = {
  "Dine-in": UtensilsCrossed,
  Takeaway: ShoppingBag,
  Delivery: Bike,
};

/** Current time, refreshed every 15 seconds. Null until mounted to avoid hydration mismatch. */
function useNow() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const first = setTimeout(() => setNow(Date.now()), 0);
    const id = setInterval(() => setNow(Date.now()), 15_000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);
  return now;
}

export function KitchenBoard() {
  const orders = useRestaurant((s) => s.orders);
  const advanceOrder = useRestaurant((s) => s.advanceOrder);
  const now = useNow();

  const active = orders.filter((o) => o.status !== "served");

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Kitchen display"
        subtitle={`${active.length} active orders · live timers turn red after 15 minutes`}
        actions={
          <div className="flex gap-2">
            {columns.map((c) => (
              <span key={c.status} className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium">
                <span className={cn("h-2 w-2 rounded-full", c.dot)} />
                {orders.filter((o) => o.status === c.status).length} {c.title.split(" ")[0]}
              </span>
            ))}
          </div>
        }
      />

      <div className="no-scrollbar -mx-4 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-3 lg:overflow-visible">
        {columns.map((col) => {
          const list = orders.filter((o) => o.status === col.status).sort((a, b) => a.createdAt - b.createdAt);
          return (
            <section key={col.status} className="w-[85vw] shrink-0 snap-start sm:w-[360px] lg:w-auto">
              <div className="mb-3 flex items-center justify-between px-1">
                <h2 className="flex items-center gap-2 font-semibold">
                  <span className={cn("h-2.5 w-2.5 rounded-full", col.dot)} />
                  {col.title}
                </h2>
                <span className="rounded-full bg-stone-200/70 px-2 py-0.5 text-xs font-semibold text-stone-600">{list.length}</span>
              </div>
              <div className="space-y-3">
                {list.map((order) => (
                  <OrderCard key={order.id} order={order} now={now} accent={col.accent} action={col.action} onAdvance={() => advanceOrder(order.id)} />
                ))}
                {list.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-stone-300 py-10 text-center text-sm text-stone-400">No orders</p>
                ) : null}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function OrderCard({
  order,
  now,
  accent,
  action,
  onAdvance,
}: {
  order: KitchenOrder;
  now: number | null;
  accent: string;
  action: string;
  onAdvance: () => void;
}) {
  const minutes = now ? Math.max(0, Math.floor((now - order.createdAt) / 60_000)) : null;
  const late = minutes !== null && minutes >= 15;
  const Icon = typeIcon[order.type];

  return (
    <article className={cn("rounded-2xl border border-t-4 border-stone-200/80 bg-white p-4 shadow-sm", accent)}>
      <header className="flex items-start justify-between">
        <div>
          <p className="text-lg font-bold">#{order.number}</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-stone-500">
            <Icon className="h-3.5 w-3.5" />
            {order.type === "Dine-in" ? `Table ${order.table.replace("T", "")}` : order.type}
          </p>
        </div>
        <Badge tone={late ? "red" : "neutral"} className="tabular-nums">
          <Clock className="h-3 w-3" />
          {minutes === null ? "—" : `${minutes} min`}
        </Badge>
      </header>
      <ul className="mt-3 space-y-1.5 border-t border-dashed border-stone-200 pt-3">
        {order.lines.map((l) => (
          <li key={l.itemId} className="text-sm">
            <span className="mr-2 inline-grid h-5 min-w-5 place-items-center rounded-md bg-stone-900 px-1 text-xs font-bold text-white">{l.qty}</span>
            <span className="font-medium">{l.name}</span>
            {l.note ? <p className="ml-7 text-xs font-medium text-orange-600">↳ {l.note}</p> : null}
          </li>
        ))}
      </ul>
      <Button variant="secondary" size="sm" className="mt-4 w-full" onClick={onAdvance}>
        {action} <ArrowRight className="h-3.5 w-3.5" />
      </Button>
    </article>
  );
}
