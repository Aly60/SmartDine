"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChefHat, LoaderCircle, ReceiptText, ShieldCheck } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Button, Field, Input } from "@/components/ui";
import { demoUsers, roleLabel, type Role } from "@/data/users";
import { cn } from "@/lib/utils";

const schema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
});
type Values = z.infer<typeof schema>;

const roleIcon: Record<Role, typeof ShieldCheck> = {
  admin: ShieldCheck,
  cashier: ReceiptText,
  kitchen: ChefHat,
};

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: demoUsers[0].email, password: demoUsers[0].password },
  });
  const email = useWatch({ control, name: "email" });

  async function onSubmit(values: Values) {
    setError(null);
    const res = await signIn("credentials", { ...values, redirect: false });
    if (!res || res.error) {
      setError("Wrong email or password.");
      return;
    }
    // proxy.ts routes each role to its home page.
    router.replace("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
      <div>
        <p className="mb-2 text-sm font-medium text-stone-700">Demo accounts</p>
        <div className="grid grid-cols-3 gap-2">
          {demoUsers.map((u) => {
            const Icon = roleIcon[u.role];
            const active = email === u.email;
            return (
              <button
                key={u.id}
                type="button"
                onClick={() => {
                  setValue("email", u.email, { shouldValidate: true });
                  setValue("password", u.password, { shouldValidate: true });
                }}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-xs font-medium transition",
                  active ? "border-orange-400 bg-orange-50 text-orange-700" : "border-stone-200 text-stone-600 hover:bg-stone-50",
                )}
              >
                <Icon className="h-5 w-5" />
                {roleLabel[u.role]}
              </button>
            );
          })}
        </div>
      </div>

      <Field label="Email" error={errors.email?.message}>
        <Input type="email" autoComplete="email" {...register("email")} />
      </Field>
      <Field label="Password" error={errors.password?.message}>
        <Input type="password" autoComplete="current-password" {...register("password")} />
      </Field>

      {error ? <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
        Sign in
      </Button>
      <p className="text-center text-xs text-stone-400">Demo project · role-based access with NextAuth.js</p>
    </form>
  );
}
