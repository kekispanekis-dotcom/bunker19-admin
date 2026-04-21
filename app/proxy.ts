import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // dejar pasar la pantalla de login
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