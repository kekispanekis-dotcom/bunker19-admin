import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import TvClient from "./TvClient";

export default async function AdminTvPage() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("admin-auth");

  if (authCookie?.value !== "true") {
    redirect("/admin/login?reason=expired");
  }

  return <TvClient />;
}