# SmartDine — Restaurant POS & Analytics (demo)

A restaurant operations demo: point of sale, kitchen display, menu & stock management and sales analytics, with role-based access.

> **Demo project.** Data is seeded in memory and resets on reload. There are no real payments or database.

## Features

- **Role-based sign-in** with NextAuth.js (Credentials). Admin, Cashier and Kitchen each see only their pages; `src/proxy.ts` enforces it.
- **POS**: menu categories, instant search, live ticket with quantities, 12% service and 14% VAT, and "send to kitchen".
- **Kitchen display**: New / Preparing / Ready columns. Elapsed timers turn red after 15 minutes.
- **Menu & stock**: add/edit dialog validated with React Hook Form + Zod, low-stock alerts, availability toggle and delete confirmation.
- **Analytics**: KPI cards, revenue vs previous period, best sellers, orders by hour and recent orders (Recharts).
- **Responsive**: sidebar on desktop; bottom navigation and a slide-up ticket on mobile.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · NextAuth.js v5 · Zustand · React Hook Form · Zod · Recharts

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

### Demo accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@smartdine.demo | demo1234 |
| Cashier | cashier@smartdine.demo | demo1234 |
| Kitchen | kitchen@smartdine.demo | demo1234 |

Set `AUTH_SECRET` in production. The app falls back to a demo secret only so that it runs without setup.

## Project structure

```
src/
  app/(app)/        dashboard, pos, kitchen, menu (signed-in area)
  app/login/        sign-in page
  auth.ts           NextAuth config and role checks
  proxy.ts          route protection (Next.js 16 "proxy", formerly middleware)
  components/       UI and feature components
  data/             demo menu, orders, analytics, users
  store/            Zustand store (ticket, kitchen orders, menu)
```
