import AdminLoginClient from "./AdminLoginClient";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const params = await searchParams;
  const reason = params?.reason ?? "";

  return <AdminLoginClient reason={reason} />;
}