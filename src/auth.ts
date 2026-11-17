import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { canAccess, demoUsers, roleHome, type Role } from "@/data/users";

const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  // Demo fallback so the project runs without setup. Set AUTH_SECRET in production.
  secret: process.env.AUTH_SECRET ?? "smartdine-local-demo-secret-change-me",
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (raw) => {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;
        const user = demoUsers.find(
          (u) => u.email === parsed.data.email.toLowerCase() && u.password === parsed.data.password,
        );
        if (!user) return null;
        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = (user as { role: Role }).role;
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role as Role;
      return session;
    },
    // Runs in proxy.ts: signed-out users go to /login, wrong roles go to their home page.
    authorized({ auth: session, request }) {
      const { pathname } = request.nextUrl;
      const isLogin = pathname.startsWith("/login");
      const role = session?.user?.role;

      if (!role) return isLogin ? true : false;
      if (isLogin || pathname === "/") {
        return Response.redirect(new URL(roleHome[role], request.nextUrl));
      }
      if (!canAccess(role, pathname)) {
        return Response.redirect(new URL(roleHome[role], request.nextUrl));
      }
      return true;
    },
  },
});
