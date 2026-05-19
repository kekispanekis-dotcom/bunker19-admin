import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import CheckinClient from "./CheckinClient";

export default async function CheckinPage() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("admin-auth");

  if (authCookie?.value !== "true") {
    redirect("/admin/login?reason=expired");
  }

  return <CheckinClient />;
}