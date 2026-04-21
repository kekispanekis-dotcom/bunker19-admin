import { NextResponse } from "next/server";

const EIGHT_HOURS = 60 * 60 * 8;

export async function POST(request: Request) {
  const body = await request.json();
  const password = body.password;

  if (password === process.env.ADMIN_PASSWORD) {
    const res = NextResponse.json({ ok: true });

    res.cookies.set("admin-auth", "true", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: EIGHT_HOURS,
    });

    return res;
  }

  return NextResponse.json(
    { error: "Password incorrecto" },
    { status: 401 }
  );
}