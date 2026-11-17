"use client";

import { ArrowDownRight, ArrowUpRight, CalendarDays, Download, Percent, ReceiptText, ShoppingBag, Wallet } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { kpis, ordersByHour, paymentSplit, recentOrders, revenueSeries, topItems } from "@/data/analytics";
import { PageHeader } from "@/components/app-shell";
import { Badge, Button, Card } from "@/components/ui";
import { cn, money } from "@/lib/utils";

const kpiIcons = [Wallet, ShoppingBag, ReceiptText, Percent];

const statusTone = {
  new: "blue",
  preparing: "amber",
  ready: "green",
  served: "neutral",
} as const;

function formatKpi(value: number, format: "money" | "number" | "percent") {
  if (format === "money") return money(value);
  if (format === "percent") return `${value}%`;
  return value.toLocaleString("en-US");
}

const axis = { fontSize: 12, fill: "#a8a29e" };

export function Dashboard() {
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Sales analytics"
        subtitle="Downtown branch · updated a few seconds ago"
        actions={
          <>
            <Button variant="secondary" size="sm">
              <CalendarDays className="h-4 w-4" /> Last 14 days
            </Button>
            <Button variant="secondary" size="sm">
              <Download className="h-4 w-4" /> Export
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {kpis.map((k, i) => {
          const Icon = kpiIcons[i];
          const up = k.delta >= 0;
          return (
            <Card key={k.label} className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-orange-50 text-orange-600">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <span className={cn("flex items-center text-xs font-semibold", up ? "text-emerald-600" : "text-red-600")}>
                  {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                  {Math.abs(k.delta)}%
                </span>
              </div>
              <p className="mt-4 text-xl font-bold tracking-tight sm:text-2xl">{formatKpi(k.value, k.format)}</p>
              <p className="mt-1 text-xs text-stone-500 sm:text-sm">{k.label}</p>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="p-5 xl:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-semibold">Revenue</h2>
              <p className="text-sm text-stone-500">This period vs previous period</p>
            </div>
            <div className="flex gap-4 text-xs text-stone-500">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-orange-500" />This period</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-stone-300" />Previous</span>
            </div>
          </div>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries} margin={{ left: -8, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#f5f5f4" vertical={false} />
                <XAxis dataKey="day" tick={axis} axisLine={false} tickLine={false} interval="preserveStartEnd" minTickGap={24} />
                <YAxis tick={axis} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v / 1000}k`} width={44} />
                <Tooltip formatter={(v) => money(Number(v))} contentStyle={{ borderRadius: 12, border: "1px solid #e7e5e4" }} />
                <Area type="monotone" dataKey="previous" stroke="#d6d3d1" strokeWidth={2} fill="transparent" strokeDasharray="4 4" />
                <Area type="monotone" dataKey="revenue" stroke="#ea580c" strokeWidth={2.5} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-semibold">Best sellers</h2>
          <p className="text-sm text-stone-500">Items sold this week</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topItems} layout="vertical" margin={{ left: 8, right: 16 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" tick={{ ...axis, fill: "#57534e" }} axisLine={false} tickLine={false} width={112} />
                <Tooltip cursor={{ fill: "#fafaf9" }} contentStyle={{ borderRadius: 12, border: "1px solid #e7e5e4" }} />
                <Bar dataKey="sold" fill="#f97316" radius={[0, 8, 8, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="p-5">
          <h2 className="font-semibold">Orders by hour</h2>
          <p className="text-sm text-stone-500">Today</p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ordersByHour} margin={{ left: -24, right: 4 }}>
                <CartesianGrid stroke="#f5f5f4" vertical={false} />
                <XAxis dataKey="hour" tick={axis} axisLine={false} tickLine={false} interval={1} />
                <YAxis tick={axis} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "#fafaf9" }} contentStyle={{ borderRadius: 12, border: "1px solid #e7e5e4" }} />
                <Bar dataKey="orders" fill="#1c1917" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2.5">
            {paymentSplit.map((p) => (
              <div key={p.method}>
                <div className="flex justify-between text-xs font-medium text-stone-600">
                  <span>{p.method}</span>
                  <span>{p.share}%</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-stone-100">
                  <div className="h-full rounded-full bg-orange-500" style={{ width: `${p.share}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="overflow-hidden xl:col-span-2">
          <div className="flex items-center justify-between p-5 pb-3">
            <div>
              <h2 className="font-semibold">Recent orders</h2>
              <p className="text-sm text-stone-500">Live from the POS</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-y border-stone-100 bg-stone-50/70 text-left text-xs font-medium uppercase tracking-wider text-stone-500">
                  <th className="px-5 py-2.5">Order</th>
                  <th className="px-3 py-2.5">Type</th>
                  <th className="px-3 py-2.5">Items</th>
                  <th className="px-3 py-2.5">Status</th>
                  <th className="px-3 py-2.5">Time</th>
                  <th className="px-5 py-2.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.number} className="border-b border-stone-100 last:border-0">
                    <td className="px-5 py-3 font-semibold">#{o.number} <span className="ml-1 font-normal text-stone-400">{o.table}</span></td>
                    <td className="px-3 py-3 text-stone-600">{o.type}</td>
                    <td className="px-3 py-3 text-stone-600">{o.items}</td>
                    <td className="px-3 py-3">
                      <Badge tone={statusTone[o.status]} className="capitalize">{o.status}</Badge>
                    </td>
                    <td className="px-3 py-3 text-stone-500">{o.time}</td>
                    <td className="px-5 py-3 text-right font-semibold tabular-nums">{money(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
