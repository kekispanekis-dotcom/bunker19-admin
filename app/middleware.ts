import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

  if (!isAdminRoute) return NextResponse.next();

  const cookie = request.cookies.get("admin-auth");

  if (cookie?.value === "true") {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/admin/login", request.url));
}