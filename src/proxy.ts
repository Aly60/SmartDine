export { auth as proxy } from "@/auth";

export const config = {
  // Everything except Next.js internals, the auth API and static files.
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
