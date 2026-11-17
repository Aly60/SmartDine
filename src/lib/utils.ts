import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const egp = new Intl.NumberFormat("en-EG", {
  style: "currency",
  currency: "EGP",
  maximumFractionDigits: 0,
});

export function money(value: number) {
  return egp.format(value);
}

export const SERVICE_RATE = 0.12;
export const VAT_RATE = 0.14;

export function orderTotals(subtotal: number) {
  const service = Math.round(subtotal * SERVICE_RATE);
  const vat = Math.round((subtotal + service) * VAT_RATE);
  return { subtotal, service, vat, total: subtotal + service + vat };
}
