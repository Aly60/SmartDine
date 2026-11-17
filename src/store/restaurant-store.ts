"use client";

import { create } from "zustand";
import { seedMenu, type MenuItem } from "@/data/menu";
import { seedKitchenOrders, type KitchenOrder, type OrderLine, type OrderStatus, type OrderType } from "@/data/orders";

type TicketState = {
  table: string;
  type: OrderType;
  lines: OrderLine[];
};

type RestaurantState = {
  menu: MenuItem[];
  orders: KitchenOrder[];
  ticket: TicketState;
  nextNumber: number;

  // POS ticket
  addToTicket: (item: MenuItem) => void;
  changeQty: (itemId: string, delta: number) => void;
  clearTicket: () => void;
  setTable: (table: string) => void;
  setOrderType: (type: OrderType) => void;
  sendToKitchen: () => number | null;

  // Kitchen
  advanceOrder: (orderId: string) => void;

  // Menu management
  /** Updates an item, or creates one when `id` is missing. */
  saveMenuItem: (item: Omit<MenuItem, "id"> & { id?: string }) => void;
  deleteMenuItem: (id: string) => void;
  toggleAvailable: (id: string) => void;
};

const nextStatus: Record<OrderStatus, OrderStatus> = {
  new: "preparing",
  preparing: "ready",
  ready: "served",
  served: "served",
};

export const useRestaurant = create<RestaurantState>((set, get) => ({
  menu: seedMenu,
  orders: seedKitchenOrders(),
  nextNumber: 1049,
  ticket: {
    table: "T5",
    type: "Dine-in",
    lines: [
      { itemId: "m1", name: "Classic Smash Burger", qty: 2, price: 185 },
      { itemId: "m3", name: "Margherita Pizza", qty: 1, price: 210 },
      { itemId: "m15", name: "Cappuccino", qty: 2, price: 55 },
    ],
  },

  addToTicket: (item) =>
    set((s) => {
      const existing = s.ticket.lines.find((l) => l.itemId === item.id);
      const lines = existing
        ? s.ticket.lines.map((l) => (l.itemId === item.id ? { ...l, qty: l.qty + 1 } : l))
        : [...s.ticket.lines, { itemId: item.id, name: item.name, qty: 1, price: item.price }];
      return { ticket: { ...s.ticket, lines } };
    }),

  changeQty: (itemId, delta) =>
    set((s) => ({
      ticket: {
        ...s.ticket,
        lines: s.ticket.lines
          .map((l) => (l.itemId === itemId ? { ...l, qty: l.qty + delta } : l))
          .filter((l) => l.qty > 0),
      },
    })),

  clearTicket: () => set((s) => ({ ticket: { ...s.ticket, lines: [] } })),
  setTable: (table) => set((s) => ({ ticket: { ...s.ticket, table } })),
  setOrderType: (type) => set((s) => ({ ticket: { ...s.ticket, type } })),

  sendToKitchen: () => {
    const { ticket, nextNumber } = get();
    if (ticket.lines.length === 0) return null;
    const order: KitchenOrder = {
      id: `o${nextNumber}`,
      number: nextNumber,
      table: ticket.type === "Dine-in" ? ticket.table : ticket.type,
      type: ticket.type,
      status: "new",
      createdAt: Date.now(),
      lines: ticket.lines,
    };
    set((s) => ({
      orders: [order, ...s.orders],
      nextNumber: s.nextNumber + 1,
      ticket: { ...s.ticket, lines: [] },
      // Reserve stock for the items that were sent.
      menu: s.menu.map((m) => {
        const line = ticket.lines.find((l) => l.itemId === m.id);
        return line ? { ...m, stock: Math.max(0, m.stock - line.qty) } : m;
      }),
    }));
    return order.number;
  },

  advanceOrder: (orderId) =>
    set((s) => ({
      orders: s.orders.map((o) => (o.id === orderId ? { ...o, status: nextStatus[o.status] } : o)),
    })),

  saveMenuItem: ({ id, ...rest }) =>
    set((s) =>
      id
        ? { menu: s.menu.map((m) => (m.id === id ? { ...rest, id } : m)) }
        : { menu: [{ ...rest, id: `m${Date.now()}` }, ...s.menu] },
    ),

  deleteMenuItem: (id) => set((s) => ({ menu: s.menu.filter((m) => m.id !== id) })),

  toggleAvailable: (id) =>
    set((s) => ({ menu: s.menu.map((m) => (m.id === id ? { ...m, available: !m.available } : m)) })),
}));
