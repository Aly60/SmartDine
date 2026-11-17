import { redirect } from "next/navigation";

// proxy.ts sends signed-in users to their role's home page before this renders.
export default function Home() {
  redirect("/login");
}
