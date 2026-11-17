import Image from "next/image";
import { LoginForm } from "./login-form";
import { Logo } from "@/components/app-shell";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <Image
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&q=75"
          alt="Grilled dishes served at a restaurant"
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-stone-950/10" />
        <div className="absolute inset-x-0 bottom-0 p-12 text-white">
          <p className="text-sm font-medium uppercase tracking-widest text-orange-300">Restaurant operations, simplified</p>
          <h2 className="mt-3 max-w-md text-4xl font-bold leading-tight">From order to kitchen to insight — in one place.</h2>
          <div className="mt-8 grid max-w-md grid-cols-3 gap-4">
            {[
              ["186", "orders today"],
              ["12 min", "avg. prep time"],
              ["+12%", "revenue vs last week"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <p className="text-2xl font-bold">{value}</p>
                <p className="mt-1 text-xs text-white/70">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-sm">
          <Logo />
          <h1 className="mt-8 text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-stone-500">Sign in to your branch workspace.</p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
