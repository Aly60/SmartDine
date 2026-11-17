export type Role = "admin" | "cashier" | "kitchen";

export type DemoUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
};

/**
 * Demo accounts for local testing only.
 * Replace with a real user store (database + hashed passwords) before production.
 */
export const demoUsers: DemoUser[] = [
  { id: "u1", name: "Mona Adel", email: "admin@smartdine.demo", password: "demo1234", role: "admin" },
  { id: "u2", name: "Omar Hany", email: "cashier@smartdine.demo", password: "demo1234", role: "cashier" },
  { id: "u3", name: "Chef Karim", email: "kitchen@smartdine.demo", password: "demo1234", role: "kitchen" },
];

export const roleLabel: Record<Role, string> = {
  admin: "Admin",
  cashier: "Cashier",
  kitchen: "Kitchen",
};

/** Landing page for each role after sign-in. */
export const roleHome: Record<Role, string> = {
  admin: "/dashboard",
  cashier: "/pos",
  kitchen: "/kitchen",
};

/** Which roles may open each section. */
export const routeAccess: { prefix: string; roles: Role[] }[] = [
  { prefix: "/dashboard", roles: ["admin"] },
  { prefix: "/menu", roles: ["admin"] },
  { prefix: "/pos", roles: ["admin", "cashier"] },
  { prefix: "/kitchen", roles: ["admin", "kitchen"] },
];

export function canAccess(role: Role, pathname: string) {
  const rule = routeAccess.find((r) => pathname.startsWith(r.prefix));
  return rule ? rule.roles.includes(role) : true;
}
