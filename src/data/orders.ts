export type OrderStatus = "new" | "preparing" | "ready" | "served";
export type OrderType = "Dine-in" | "Takeaway" | "Delivery";

export type OrderLine = { itemId: string; name: string; qty: number; price: number; note?: string };

export type KitchenOrder = {
  id: string;
  number: number;
  table: string;
  type: OrderType;
  status: OrderStatus;
  createdAt: number;
  lines: OrderLine[];
};

const minutesAgo = (m: number) => Date.now() - m * 60_000;

export function seedKitchenOrders(): KitchenOrder[] {
  return [
    {
      id: "o1", number: 1048, table: "T4", type: "Dine-in", status: "new", createdAt: minutesAgo(2),
      lines: [
        { itemId: "m1", name: "Classic Smash Burger", qty: 2, price: 185, note: "No onions" },
        { itemId: "m2", name: "Loaded Fries", qty: 1, price: 75 },
        { itemId: "m16", name: "Fresh Lemon Mint", qty: 2, price: 45 },
      ],
    },
    {
      id: "o2", number: 1047, table: "Takeaway", type: "Takeaway", status: "new", createdAt: minutesAgo(4),
      lines: [
        { itemId: "m7", name: "Chicken Shawarma Wrap", qty: 3, price: 120 },
        { itemId: "m15", name: "Cappuccino", qty: 1, price: 55 },
      ],
    },
    {
      id: "o3", number: 1046, table: "T9", type: "Dine-in", status: "new", createdAt: minutesAgo(6),
      lines: [
        { itemId: "m9", name: "Salmon Poke Bowl", qty: 1, price: 240 },
        { itemId: "m10", name: "Garden Buddha Bowl", qty: 1, price: 150, note: "Dressing on the side" },
      ],
    },
    {
      id: "o4", number: 1045, table: "T2", type: "Dine-in", status: "preparing", createdAt: minutesAgo(11),
      lines: [
        { itemId: "m5", name: "Ribeye Steak & Fries", qty: 2, price: 420, note: "Medium rare" },
        { itemId: "m3", name: "Margherita Pizza", qty: 1, price: 210 },
      ],
    },
    {
      id: "o5", number: 1044, table: "Delivery", type: "Delivery", status: "preparing", createdAt: minutesAgo(14),
      lines: [
        { itemId: "m8", name: "Mixed Grill Platter", qty: 1, price: 480 },
        { itemId: "m12", name: "Chocolate Fudge Cake", qty: 2, price: 95 },
      ],
    },
    {
      id: "o6", number: 1043, table: "T7", type: "Dine-in", status: "preparing", createdAt: minutesAgo(18),
      lines: [
        { itemId: "m4", name: "Penne Arrabbiata", qty: 2, price: 165 },
        { itemId: "m17", name: "Berry Mocktail", qty: 2, price: 70 },
      ],
    },
    {
      id: "o7", number: 1042, table: "T1", type: "Dine-in", status: "ready", createdAt: minutesAgo(21),
      lines: [
        { itemId: "m6", name: "Herb Roast Chicken", qty: 1, price: 260 },
        { itemId: "m13", name: "Buttermilk Pancakes", qty: 1, price: 110 },
      ],
    },
    {
      id: "o8", number: 1041, table: "Takeaway", type: "Takeaway", status: "ready", createdAt: minutesAgo(25),
      lines: [{ itemId: "m11", name: "Salmon Sushi Set", qty: 2, price: 295 }],
    },
  ];
}
