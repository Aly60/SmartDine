/** Static demo analytics. In production these would come from an API. */

export const kpis = [
  { label: "Revenue today", value: 48_650, format: "money" as const, delta: 12.4 },
  { label: "Orders today", value: 186, format: "number" as const, delta: 8.1 },
  { label: "Average ticket", value: 262, format: "money" as const, delta: 3.9 },
  { label: "Table occupancy", value: 78, format: "percent" as const, delta: -2.3 },
];

const days = ["Nov 4", "Nov 5", "Nov 6", "Nov 7", "Nov 8", "Nov 9", "Nov 10", "Nov 11", "Nov 12", "Nov 13", "Nov 14", "Nov 15", "Nov 16", "Nov 17"];
const revenue = [31200, 29800, 34500, 38900, 45200, 51800, 47600, 33100, 30400, 36800, 41500, 49300, 55100, 48650];
const lastPeriod = [28400, 27900, 31000, 35200, 41800, 46500, 43900, 30200, 29800, 33600, 38900, 44100, 47800, 43200];

export const revenueSeries = days.map((day, i) => ({
  day,
  revenue: revenue[i],
  previous: lastPeriod[i],
}));

export const topItems = [
  { name: "Smash Burger", sold: 142 },
  { name: "Shawarma Wrap", sold: 128 },
  { name: "Margherita", sold: 96 },
  { name: "Poke Bowl", sold: 81 },
  { name: "Ribeye Steak", sold: 64 },
  { name: "Cappuccino", sold: 159 },
].sort((a, b) => b.sold - a.sold);

export const ordersByHour = [
  { hour: "11am", orders: 8 },
  { hour: "12pm", orders: 17 },
  { hour: "1pm", orders: 26 },
  { hour: "2pm", orders: 22 },
  { hour: "3pm", orders: 11 },
  { hour: "4pm", orders: 9 },
  { hour: "5pm", orders: 12 },
  { hour: "6pm", orders: 19 },
  { hour: "7pm", orders: 28 },
  { hour: "8pm", orders: 33 },
  { hour: "9pm", orders: 24 },
  { hour: "10pm", orders: 14 },
];

export const paymentSplit = [
  { method: "Card", share: 54 },
  { method: "Cash", share: 31 },
  { method: "Wallet", share: 15 },
];

export const recentOrders = [
  { number: 1048, table: "T4", type: "Dine-in", items: 5, total: 670, status: "new", time: "8:42 PM" },
  { number: 1047, table: "—", type: "Takeaway", items: 4, total: 470, status: "new", time: "8:40 PM" },
  { number: 1046, table: "T9", type: "Dine-in", items: 2, total: 445, status: "new", time: "8:38 PM" },
  { number: 1045, table: "T2", type: "Dine-in", items: 3, total: 1195, status: "preparing", time: "8:33 PM" },
  { number: 1044, table: "—", type: "Delivery", items: 3, total: 765, status: "preparing", time: "8:30 PM" },
  { number: 1043, table: "T7", type: "Dine-in", items: 4, total: 545, status: "preparing", time: "8:26 PM" },
  { number: 1042, table: "T1", type: "Dine-in", items: 2, total: 420, status: "ready", time: "8:23 PM" },
  { number: 1040, table: "T6", type: "Dine-in", items: 6, total: 1340, status: "served", time: "8:10 PM" },
] as const;
