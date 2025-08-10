// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const cookies = request.cookies;
  // common Laravel session cookie name (laravel_session) or your custom fallback 'token'
  const hasSession =
    !!cookies.get("laravel_session")?.value || !!cookies.get("token")?.value;

  const { pathname } = request.nextUrl;

  // protect admin paths
  const isAdminPath = pathname.startsWith("/admin");

  if (isAdminPath && !hasSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // prevent logged-in users from visiting login
  if (hasSession && pathname === "/login") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
