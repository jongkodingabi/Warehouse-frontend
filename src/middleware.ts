import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;
  const tokenExpiresAt = request.cookies.get("token_expires_at")?.value;
  const { pathname } = request.nextUrl;

  // Cek kadaluarsa token
  if (token && tokenExpiresAt && Date.now() > Number(tokenExpiresAt)) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("token");
    response.cookies.delete("role");
    response.cookies.delete("token_expires_at");
    return response;
  }

  // Kalau sudah login dan buka /login → redirect sesuai role
  if (pathname === "/login" && token) {
    if (role === "superadmin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    if (role === "admingudang") {
      return NextResponse.redirect(
        new URL("/adminGudang/dashboard", request.url)
      );
    }
  }

  // Kalau tidak login, blok akses ke admin
  if (
    (pathname.startsWith("/admin") || pathname.startsWith("/adminGudang")) &&
    !token
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Proteksi cross-access
  if (pathname.startsWith("/admin/") && role !== "superadmin") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (pathname.startsWith("/adminGudang/") && role !== "admingudang") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/adminGudang/:path*", "/login"],
};
