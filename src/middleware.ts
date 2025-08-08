import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // 1️⃣ Halaman admin (hanya untuk yang sudah login)
  const protectedRoutes = ["/admin"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // 2️⃣ Halaman login (hanya untuk yang belum login)
  if (token && pathname.startsWith("/auth/login")) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*", // Lindungi halaman admin
    "/auth/login", // Blokir akses login jika sudah login
  ],
};
