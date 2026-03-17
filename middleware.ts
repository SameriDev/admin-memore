import { NextRequest, NextResponse } from "next/server";

const protectedPrefixes = ["/dashboard", "/users", "/photos", "/albums", "/premium"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (!isProtected) {
    return NextResponse.next();
  }

  const session = request.cookies.get("memore_admin_session");
  if (!session) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/users/:path*", "/photos/:path*", "/albums/:path*", "/premium/:path*"],
};
