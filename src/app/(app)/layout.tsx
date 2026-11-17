import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { auth, signOut } from "@/auth";
import { AppShell } from "@/components/app-shell";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  async function logout() {
    "use server";
    await signOut({ redirectTo: "/login" });
  }

  return (
    <AppShell user={{ name: session.user.name ?? "Staff", role: session.user.role }} logout={logout}>
      {children}
    </AppShell>
  );
}
