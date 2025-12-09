import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Path yang tidak memerlukan authentication
const publicPaths = ["/login", "/register", "/", "/home", "/motors", "/booking"];

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

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value,
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value,
          ...options,
        });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value: "",
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value: "",
          ...options,
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log(`[Middleware] Path: ${pathname}, User exists: ${!!user}`);

  if (!user) {
    console.log(`[Middleware] No user for protected path ${pathname}, redirecting to /login`);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Check admin access
  if (pathname.startsWith("/admin")) {
    // Get user role from database
    const { data: userData } = await supabase.from("User").select("role").eq("email", user.email).single();

    if (userData?.role !== "ADMIN") {
      console.log(`[Middleware] Non-admin trying to access admin, redirecting to /home`);
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }

  console.log(`[Middleware] Valid user: ${user.email}`);

  return response;
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
