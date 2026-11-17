"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, ChefHat, LogOut, ReceiptText, UtensilsCrossed } from "lucide-react";
import type { ReactNode } from "react";
import { canAccess, roleLabel, type Role } from "@/data/users";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Analytics", icon: BarChart3 },
  { href: "/pos", label: "Point of Sale", icon: ReceiptText },
  { href: "/kitchen", label: "Kitchen", icon: ChefHat },
  { href: "/menu", label: "Menu & Stock", icon: UtensilsCrossed },
];

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-md shadow-orange-500/30">
        <UtensilsCrossed className="h-4.5 w-4.5" />
      </div>
      <span className="text-lg font-bold tracking-tight">
        Smart<span className="text-orange-600">Dine</span>
      </span>
    </div>
  );
}

export function AppShell({
  user,
  logout,
  children,
}: {
  user: { name: string; role: Role };
  logout: () => Promise<void>;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const items = nav.filter((n) => canAccess(user.role, n.href));
  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-stone-200 bg-white px-4 py-5 lg:flex">
        <Logo className="px-2" />
        <p className="mt-6 px-3 text-[11px] font-semibold uppercase tracking-wider text-stone-400">Workspace</p>
        <nav className="mt-2 space-y-1">
          {items.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  active ? "bg-orange-50 text-orange-700" : "text-stone-600 hover:bg-stone-100",
                )}
              >
                <Icon className="h-4.5 w-4.5" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto rounded-2xl border border-stone-200 bg-stone-50 p-3">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-stone-900 text-xs font-semibold text-white">{initials}</div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-stone-500">{roleLabel[user.role]} · Downtown branch</p>
            </div>
            <form action={logout}>
              <button className="rounded-lg p-2 text-stone-500 hover:bg-stone-200" aria-label="Sign out">
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-stone-200 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
          <Logo />
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700">{roleLabel[user.role]}</span>
            <form action={logout}>
              <button className="rounded-lg p-2 text-stone-500" aria-label="Sign out">
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </div>
        </header>

        <main className="flex-1 pb-20 lg:pb-0">{children}</main>

        {/* Mobile bottom navigation */}
        <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-stone-200 bg-white lg:hidden">
          {items.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium",
                  active ? "text-orange-600" : "text-stone-500",
                )}
              >
                <Icon className="h-5 w-5" />
                {label.replace("Point of Sale", "POS").replace("Menu & Stock", "Menu")}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-stone-500">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}
