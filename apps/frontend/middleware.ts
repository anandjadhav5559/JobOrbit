import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// These routes are always accessible without auth
const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/verify-otp",
  "/forgot-password",
  "/reset-password",
  "/",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Allow all public routes
  if (PUBLIC_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"))) {
    return NextResponse.next();
  }

  // NOTE: Zustand persists auth in localStorage, which is NOT readable in middleware.
  // Auth protection for private routes is handled client-side in AppShell.tsx.
  // This middleware simply allows the request through; the client-side guard
  // in AppShell will redirect to /login if the user is not authenticated.
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
