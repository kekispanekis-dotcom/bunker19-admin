import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Dejar pasar todo lo que no sea admin
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // IMPORTANTE: permitir la página de login
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const cookie = request.cookies.get("admin-auth");

  if (cookie?.value === "true") {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/admin/login", request.url));
}

export const config = {
  matcher: ["/admin/:path*"],
};