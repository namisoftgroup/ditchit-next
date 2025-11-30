import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import createMiddleware from "next-intl/middleware";

// Create the next-intl middleware instance
const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  // Extract locale from the first path segment
  const pathSegments = pathname.split("/").filter(Boolean);
  const locale = routing.locales.includes(pathSegments[0])
    ? pathSegments[0]
    : routing.defaultLocale;

  // Build the path without the locale prefix (for matching)
  const normalizedPath = routing.locales.includes(pathSegments[0])
    ? `/${pathSegments.slice(1).join("/")}`
    : pathname;

  // --- AUTH & PROTECTED ROUTES ---
  const PROTECTED_ROUTES = [
    "/profile",
    "/profile/my-favorites",
    "/profile/edit-profile",
    "/profile/change-password",
    "/create-post",
    "/edit-post",
    "/chats",
  ];

  const AUTH_ROUTES = [
    "/login",
    "/register",
    "/reset-password",
    "/reset-password/verify-otp",
  ];

  const isProtectedRoute =
    PROTECTED_ROUTES.includes(normalizedPath) ||
    normalizedPath.startsWith("/chats/");

  const isAuthRoute = AUTH_ROUTES.includes(normalizedPath);

  // If protected route → must have token
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  // If auth route → redirect logged-in users away
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  // Let next-intl handle locale and routing
  return intlMiddleware(request);
}

export const config = {
  // Match all paths except API, assets, etc.
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
