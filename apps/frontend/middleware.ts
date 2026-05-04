import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register", "/verify-otp", "/forgot-password", "/reset-password"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  // Allow static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check for auth cookie presence (we can't read localStorage in middleware)
  // We check for our persisted zustand key in cookies or redirect
  const authCookie = request.cookies.get("joborbit_auth");

  // If no cookie-based auth signal, redirect to login
  // Note: Zustand persist stores in localStorage — we use a client-side guard too
  // This middleware handles the initial navigation guard
  if (!authCookie) {
    // For the root path, redirect to login
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
