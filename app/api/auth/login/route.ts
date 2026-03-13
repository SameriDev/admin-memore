import { NextResponse } from "next/server";

const BE_BASE_URL = process.env.MEMORE_BE_BASE_URL ?? "http://localhost:8080";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  const expectedUser = process.env.ADMIN_UI_USER;
  const expectedPassword = process.env.ADMIN_UI_PASSWORD;
  const adminEmail = process.env.MEMORE_ADMIN_EMAIL;
  const adminPassword = process.env.MEMORE_ADMIN_PASSWORD;

  if (!expectedUser || !expectedPassword || !adminEmail || !adminPassword) {
    return NextResponse.json(
      { message: "Missing admin environment configuration." },
      { status: 500 }
    );
  }

  if (username !== expectedUser || password !== expectedPassword) {
    return NextResponse.json({ message: "Invalid credentials." }, { status: 401 });
  }

  const loginResponse = await fetch(`${BE_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: adminEmail, password: adminPassword }),
  });

  const data = await loginResponse.json();
  if (!loginResponse.ok || !data?.accessToken) {
    return NextResponse.json(
      { message: data?.message ?? "Backend login failed." },
      { status: 401 }
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
