import { NextResponse } from "next/server";

const BE_BASE_URL = process.env.MEMORE_BE_BASE_URL ?? "http://localhost:8080";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required." },
      { status: 400 }
    );
  }

  const loginResponse = await fetch(`${BE_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await loginResponse.json();
  if (!loginResponse.ok || !data?.accessToken) {
    return NextResponse.json(
      { message: data?.message ?? "Backend login failed." },
      { status: 401 }
    );
  }
  if (data?.user?.role && data.user.role !== "ADMIN") {
    return NextResponse.json(
      { message: "Admin access required." },
      { status: 403 }
    );
  }

  const response = NextResponse.json({ success: true });
  const isProd = process.env.NODE_ENV === "production";

  response.cookies.set("memore_admin_session", "1", {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: 60 * 60 * 12,
    path: "/",
  });

  response.cookies.set("memore_admin_token", data.accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: 60 * 60 * 12,
    path: "/",
  });

  return response;
}
