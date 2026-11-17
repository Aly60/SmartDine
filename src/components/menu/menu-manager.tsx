"use client";

import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { categories, LOW_STOCK, type Category, type MenuItem } from "@/data/menu";
import { PageHeader } from "@/components/app-shell";
import { Badge, Button, Card, Dialog, Field, Input } from "@/components/ui";
import { useRestaurant } from "@/store/restaurant-store";
import { cn, money } from "@/lib/utils";

const itemSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters"),
  category: z.enum(categories),
  price: z.number({ error: "Enter a price" }).positive("Price must be above 0").max(5000, "Price looks too high"),
  stock: z.number({ error: "Enter stock" }).int("Whole numbers only").min(0, "Stock can't be negative"),
  image: z.url("Enter a valid image URL"),
  available: z.boolean(),
});
type ItemValues = z.infer<typeof itemSchema>;

export function MenuManager() {
  const menu = useRestaurant((s) => s.menu);
  const toggleAvailable = useRestaurant((s) => s.toggleAvailable);
  const deleteMenuItem = useRestaurant((s) => s.deleteMenuItem);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "All">("All");
  const [editing, setEditing] = useState<MenuItem | "new" | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<MenuItem | null>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return menu.filter(
      (m) => (category === "All" || m.category === category) && (!q || m.name.toLowerCase().includes(q)),
    );
  }, [menu, query, category]);

  const lowStock = menu.filter((m) => m.stock <= LOW_STOCK).length;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Menu & stock"
        subtitle={`${menu.length} items · ${lowStock} running low`}
        actions={
          <Button onClick={() => setEditing("new")}>
            <Plus className="h-4 w-4" /> Add item
          </Button>
        }
      />

      {lowStock > 0 ? (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {lowStock} items are at or below {LOW_STOCK} portions. Restock before the dinner rush.
        </div>
      ) : null}

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-stone-100 p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search items…" className="pl-9" />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category | "All")}
            className="h-10 rounded-xl border border-stone-200 bg-white px-3 text-sm"
            aria-label="Category"
          >
            <option value="All">All categories</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Desktop table */}
        <table className="hidden w-full text-sm md:table">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50/70 text-left text-xs font-medium uppercase tracking-wider text-stone-500">
              <th className="px-5 py-3">Item</th>
              <th className="px-3 py-3">Category</th>
              <th className="px-3 py-3">Price</th>
              <th className="px-3 py-3">Stock</th>
              <th className="px-3 py-3">Available</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => (
              <tr key={m.id} className="border-b border-stone-100 last:border-0 hover:bg-stone-50/60">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                      <Image src={m.image} alt="" fill sizes="44px" className="object-cover" />
                    </div>
                    <span className="font-semibold">{m.name}</span>
                  </div>
                </td>
                <td className="px-3 py-3 text-stone-600">{m.category}</td>
                <td className="px-3 py-3 font-medium tabular-nums">{money(m.price)}</td>
                <td className="px-3 py-3"><StockBadge stock={m.stock} /></td>
                <td className="px-3 py-3"><Switch on={m.available} onChange={() => toggleAvailable(m.id)} label={`Toggle ${m.name}`} /></td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setEditing(m)} aria-label={`Edit ${m.name}`}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => setConfirmDelete(m)} aria-label={`Delete ${m.name}`}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile list */}
        <ul className="divide-y divide-stone-100 md:hidden">
          {rows.map((m) => (
            <li key={m.id} className="flex items-center gap-3 p-4">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                <Image src={m.image} alt="" fill sizes="56px" className="object-cover" />
              </div>
              <button className="min-w-0 flex-1 text-left" onClick={() => setEditing(m)}>
                <p className="truncate font-semibold">{m.name}</p>
                <p className="text-sm text-stone-500">{money(m.price)} · {m.category}</p>
                <div className="mt-1"><StockBadge stock={m.stock} /></div>
              </button>
              <Switch on={m.available} onChange={() => toggleAvailable(m.id)} label={`Toggle ${m.name}`} />
            </li>
          ))}
        </ul>
        {rows.length === 0 ? <p className="py-12 text-center text-sm text-stone-400">No items match your search.</p> : null}
      </Card>

      <Dialog open={editing !== null} onClose={() => setEditing(null)} title={editing === "new" ? "Add menu item" : "Edit menu item"}>
        {editing !== null ? <ItemForm key={editing === "new" ? "new" : editing.id} item={editing === "new" ? null : editing} onDone={() => setEditing(null)} /> : null}
      </Dialog>

      <Dialog open={confirmDelete !== null} onClose={() => setConfirmDelete(null)} title="Delete item?">
        <p className="text-sm text-stone-600">
          <strong>{confirmDelete?.name}</strong> will be removed from the menu and the POS. This can&apos;t be undone.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setConfirmDelete(null)}>Cancel</Button>
          <Button
            variant="danger"
            onClick={() => {
              if (confirmDelete) deleteMenuItem(confirmDelete.id);
              setConfirmDelete(null);
            }}
          >
            Delete
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <Badge tone="red">Out of stock</Badge>;
  if (stock <= LOW_STOCK) return <Badge tone="amber">{stock} left · low</Badge>;
  return <Badge tone="green">{stock} in stock</Badge>;
}

function Switch({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onChange}
      className={cn("relative h-6 w-11 shrink-0 rounded-full transition", on ? "bg-emerald-500" : "bg-stone-300")}
    >
      <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all", on ? "left-[22px]" : "left-0.5")} />
    </button>
  );
}

function ItemForm({ item, onDone }: { item: MenuItem | null; onDone: () => void }) {
  const saveMenuItem = useRestaurant((s) => s.saveMenuItem);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ItemValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: item ?? {
      name: "",
      category: "Burgers",
      price: 0,
      stock: 20,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=480&h=360&fit=crop&q=70",
      available: true,
    },
  });

  function onSubmit(values: ItemValues) {
    saveMenuItem({ ...values, id: item?.id, popular: item?.popular });
    onDone();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <Field label="Name" error={errors.name?.message}>
        <Input {...register("name")} placeholder="e.g. Spicy Chicken Burger" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Category" error={errors.category?.message}>
          <select {...register("category")} className="h-10 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm">
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="Price (EGP)" error={errors.price?.message}>
          <Input type="number" inputMode="decimal" {...register("price", { valueAsNumber: true })} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Stock (portions)" error={errors.stock?.message}>
          <Input type="number" inputMode="numeric" {...register("stock", { valueAsNumber: true })} />
        </Field>
        <label className="flex items-end gap-2 pb-2.5 text-sm font-medium text-stone-700">
          <input type="checkbox" className="h-4 w-4 accent-orange-600" {...register("available")} />
          Available on POS
        </label>
      </div>
      <Field label="Image URL" error={errors.image?.message}>
        <Input {...register("image")} />
      </Field>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onDone}>Cancel</Button>
        <Button type="submit">{item ? "Save changes" : "Add item"}</Button>
      </div>
    </form>
  );
}
