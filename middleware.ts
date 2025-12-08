import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyTokenEdge } from "./lib/auth-edge";

// Path yang tidak memerlukan authentication
const publicPaths = ["/login", "/register", "/"];

// Path yang hanya bisa diakses admin
const adminPaths = ["/admin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware untuk public paths
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Skip middleware untuk API routes, static files, dll
  if (pathname.startsWith("/api") || pathname.startsWith("/_next") || pathname.startsWith("/static") || pathname.includes(".")) {
    return NextResponse.next();
  }

  // Get token dari cookie atau header
  const token = request.cookies.get("token")?.value || request.headers.get("authorization")?.replace("Bearer ", "");

  console.log(`[Middleware] Path: ${pathname}, Token exists: ${!!token}`);

  if (!token) {
    console.log(`[Middleware] No token, redirecting to /login`);
    // Redirect ke login jika tidak ada token
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Verify token (async untuk Edge Runtime)
  const payload = await verifyTokenEdge(token);

  if (!payload) {
    console.log(`[Middleware] Invalid token, redirecting to /login`);
    // Token invalid, redirect ke login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  console.log(`[Middleware] Valid token for user: ${payload.email}, role: ${payload.role}`);

  // Check admin access
  if (pathname.startsWith("/admin") && payload.role !== "ADMIN") {
    console.log(`[Middleware] Non-admin trying to access admin, redirecting to /home`);
    // Non-admin trying to access admin page
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
