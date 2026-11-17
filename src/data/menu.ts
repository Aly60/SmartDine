export const categories = [
  "Burgers",
  "Pizza & Pasta",
  "Grill",
  "Bowls & Sushi",
  "Desserts",
  "Drinks",
] as const;

export type Category = (typeof categories)[number];

export type MenuItem = {
  id: string;
  name: string;
  category: Category;
  price: number;
  stock: number;
  image: string;
  available: boolean;
  popular?: boolean;
};

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=480&h=360&fit=crop&q=70`;

export const LOW_STOCK = 8;

export const seedMenu: MenuItem[] = [
  { id: "m1", name: "Classic Smash Burger", category: "Burgers", price: 185, stock: 42, image: img("1568901346375-23c9450c58cd"), available: true, popular: true },
  { id: "m2", name: "Loaded Fries", category: "Burgers", price: 75, stock: 60, image: img("1573080496219-bb080dd4f877"), available: true },
  { id: "m3", name: "Margherita Pizza", category: "Pizza & Pasta", price: 210, stock: 25, image: img("1565299624946-b28f40a0ae38"), available: true, popular: true },
  { id: "m4", name: "Penne Arrabbiata", category: "Pizza & Pasta", price: 165, stock: 18, image: img("1621996346565-e3dbc646d9a9"), available: true },
  { id: "m5", name: "Ribeye Steak & Fries", category: "Grill", price: 420, stock: 4, image: img("1600891964092-4316c288032e"), available: true, popular: true },
  { id: "m6", name: "Herb Roast Chicken", category: "Grill", price: 260, stock: 12, image: img("1598103442097-8b74394b95c6"), available: true },
  { id: "m7", name: "Chicken Shawarma Wrap", category: "Grill", price: 120, stock: 35, image: img("1529006557810-274b9b2fc783"), available: true, popular: true },
  { id: "m8", name: "Mixed Grill Platter", category: "Grill", price: 480, stock: 9, image: img("1504674900247-0877df9cc836"), available: true },
  { id: "m9", name: "Salmon Poke Bowl", category: "Bowls & Sushi", price: 240, stock: 14, image: img("1546069901-ba9599a7e63c"), available: true },
  { id: "m10", name: "Garden Buddha Bowl", category: "Bowls & Sushi", price: 150, stock: 20, image: img("1512621776951-a57141f2eefd"), available: true },
  { id: "m11", name: "Salmon Sushi Set", category: "Bowls & Sushi", price: 295, stock: 6, image: img("1579871494447-9811cf80d66c"), available: true },
  { id: "m12", name: "Chocolate Fudge Cake", category: "Desserts", price: 95, stock: 16, image: img("1578985545062-69928b1d9587"), available: true },
  { id: "m13", name: "Buttermilk Pancakes", category: "Desserts", price: 110, stock: 22, image: img("1567620905732-2d1ec7ab7445"), available: true },
  { id: "m14", name: "Glazed Donuts", category: "Desserts", price: 60, stock: 3, image: img("1551024601-bec78aea704b"), available: false },
  { id: "m15", name: "Cappuccino", category: "Drinks", price: 55, stock: 80, image: img("1509042239860-f550ce710b93"), available: true },
  { id: "m16", name: "Fresh Lemon Mint", category: "Drinks", price: 45, stock: 50, image: img("1621263764928-df1444c5e859"), available: true },
  { id: "m17", name: "Berry Mocktail", category: "Drinks", price: 70, stock: 30, image: img("1544145945-f90425340c7e"), available: true },
];
