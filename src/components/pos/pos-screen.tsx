"use client";

import Image from "next/image";
import { CheckCircle2, Minus, Plus, Search, ShoppingBag, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { categories, LOW_STOCK, type Category } from "@/data/menu";
import type { OrderType } from "@/data/orders";
import { Badge, Button, Card, Input } from "@/components/ui";
import { useRestaurant } from "@/store/restaurant-store";
import { cn, money, orderTotals } from "@/lib/utils";

const orderTypes: OrderType[] = ["Dine-in", "Takeaway", "Delivery"];
const tables = Array.from({ length: 12 }, (_, i) => `T${i + 1}`);

export function PosScreen() {
  const menu = useRestaurant((s) => s.menu);
  const addToTicket = useRestaurant((s) => s.addToTicket);
  const ticket = useRestaurant((s) => s.ticket);
  const [category, setCategory] = useState<Category | "All">("All");
  const [query, setQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return menu.filter(
      (m) => (category === "All" || m.category === category) && (!q || m.name.toLowerCase().includes(q)),
    );
  }, [menu, category, query]);

  const itemCount = ticket.lines.reduce((n, l) => n + l.qty, 0);
  const { total } = orderTotals(ticket.lines.reduce((n, l) => n + l.qty * l.price, 0));

  return (
    <div className="flex min-h-screen">
      <section className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">New order</h1>
            <p className="mt-1 text-sm text-stone-500">Tap an item to add it to the ticket.</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search menu…" className="pl-9" />
          </div>
        </div>

        <div className="no-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {(["All", ...categories] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition",
                category === c
                  ? "border-stone-900 bg-stone-900 text-white"
                  : "border-stone-200 bg-white text-stone-600 hover:border-stone-300",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 2xl:grid-cols-4">
          {visible.map((item) => {
            const disabled = !item.available || item.stock === 0;
            return (
              <button
                key={item.id}
                disabled={disabled}
                onClick={() => addToTicket(item)}
                className="group overflow-hidden rounded-2xl border border-stone-200/80 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(min-width: 1536px) 20vw, (min-width: 768px) 25vw, 50vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                  {item.popular ? <Badge tone="orange" className="absolute left-2 top-2 bg-white/90">Popular</Badge> : null}
                  {disabled ? (
                    <span className="absolute inset-0 grid place-items-center bg-stone-900/50 text-sm font-semibold text-white">Unavailable</span>
                  ) : item.stock <= LOW_STOCK ? (
                    <Badge tone="red" className="absolute right-2 top-2 bg-white/90">{item.stock} left</Badge>
                  ) : null}
                </div>
                <div className="flex items-center justify-between gap-2 p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{item.name}</p>
                    <p className="text-sm text-stone-500">{money(item.price)}</p>
                  </div>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-orange-50 text-orange-600 transition group-hover:bg-orange-600 group-hover:text-white">
                    <Plus className="h-4 w-4" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Desktop ticket */}
      <aside className="sticky top-0 hidden h-screen w-[380px] shrink-0 border-l border-stone-200 bg-white xl:block">
        <Ticket />
      </aside>

      {/* Mobile / tablet: floating summary + bottom sheet */}
      {itemCount > 0 ? (
        <button
          onClick={() => setSheetOpen(true)}
          className="fixed inset-x-4 bottom-20 z-20 flex items-center justify-between rounded-2xl bg-stone-900 px-4 py-3.5 text-white shadow-xl lg:bottom-6 lg:left-[calc(16rem+1.5rem)] xl:hidden"
        >
          <span className="flex items-center gap-2 text-sm font-medium">
            <ShoppingBag className="h-4 w-4" /> {itemCount} items · {ticket.type === "Dine-in" ? ticket.table : ticket.type}
          </span>
          <span className="text-sm font-semibold">{money(total)} →</span>
        </button>
      ) : null}
      {sheetOpen ? (
        <div className="fixed inset-0 z-40 bg-stone-900/40 xl:hidden" onClick={() => setSheetOpen(false)}>
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-hidden rounded-t-3xl bg-white" onClick={(e) => e.stopPropagation()}>
            <Ticket onSent={() => setSheetOpen(false)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Ticket({ onSent }: { onSent?: () => void }) {
  const ticket = useRestaurant((s) => s.ticket);
  const nextNumber = useRestaurant((s) => s.nextNumber);
  const changeQty = useRestaurant((s) => s.changeQty);
  const clearTicket = useRestaurant((s) => s.clearTicket);
  const setTable = useRestaurant((s) => s.setTable);
  const setOrderType = useRestaurant((s) => s.setOrderType);
  const sendToKitchen = useRestaurant((s) => s.sendToKitchen);
  const [sent, setSent] = useState<number | null>(null);

  const subtotal = ticket.lines.reduce((n, l) => n + l.qty * l.price, 0);
  const totals = orderTotals(subtotal);

  function send() {
    const number = sendToKitchen();
    if (number) {
      setSent(number);
      onSent?.();
      setTimeout(() => setSent(null), 3000);
    }
  }

  return (
    <div className="flex h-full max-h-[85vh] flex-col xl:max-h-none">
      <div className="border-b border-stone-100 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-stone-400">Current ticket</p>
            <h2 className="text-lg font-bold">Order #{nextNumber}</h2>
          </div>
          <select
            value={ticket.table}
            onChange={(e) => setTable(e.target.value)}
            disabled={ticket.type !== "Dine-in"}
            className="h-9 rounded-xl border border-stone-200 bg-white px-3 text-sm font-medium disabled:opacity-40"
            aria-label="Table"
          >
            {tables.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-1 rounded-xl bg-stone-100 p-1">
          {orderTypes.map((t) => (
            <button
              key={t}
              onClick={() => setOrderType(t)}
              className={cn(
                "rounded-lg py-1.5 text-xs font-semibold transition",
                ticket.type === t ? "bg-white text-stone-900 shadow-sm" : "text-stone-500",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-5">
        {sent ? (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm font-medium text-emerald-700">
            <CheckCircle2 className="h-4 w-4" /> Order #{sent} sent to the kitchen
          </div>
        ) : null}
        {ticket.lines.length === 0 ? (
          <div className="grid h-full place-items-center py-10 text-center text-sm text-stone-400">
            <div>
              <ShoppingBag className="mx-auto mb-2 h-8 w-8" />
              No items yet
            </div>
          </div>
        ) : (
          ticket.lines.map((line) => (
            <Card key={line.itemId} className="flex items-center gap-3 p-3 shadow-none">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{line.name}</p>
                <p className="text-xs text-stone-500">{money(line.price)} each</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => changeQty(line.itemId, -1)} className="grid h-7 w-7 place-items-center rounded-lg border border-stone-200 hover:bg-stone-50" aria-label="Decrease">
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-6 text-center text-sm font-semibold tabular-nums">{line.qty}</span>
                <button onClick={() => changeQty(line.itemId, 1)} className="grid h-7 w-7 place-items-center rounded-lg border border-stone-200 hover:bg-stone-50" aria-label="Increase">
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="w-20 text-right text-sm font-semibold tabular-nums">{money(line.qty * line.price)}</p>
            </Card>
          ))
        )}
      </div>

      <div className="space-y-2 border-t border-stone-100 p-5 text-sm">
        <Row label="Subtotal" value={money(totals.subtotal)} />
        <Row label="Service (12%)" value={money(totals.service)} />
        <Row label="VAT (14%)" value={money(totals.vat)} />
        <div className="flex items-center justify-between pt-2 text-base font-bold">
          <span>Total</span>
          <span className="tabular-nums">{money(totals.total)}</span>
        </div>
        <div className="grid grid-cols-[auto_1fr] gap-2 pt-3">
          <Button variant="secondary" size="lg" onClick={clearTicket} disabled={!ticket.lines.length} aria-label="Clear ticket">
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button size="lg" onClick={send} disabled={!ticket.lines.length}>
            Send to kitchen
          </Button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-stone-500">
      <span>{label}</span>
      <span className="tabular-nums text-stone-700">{value}</span>
    </div>
  );
}
