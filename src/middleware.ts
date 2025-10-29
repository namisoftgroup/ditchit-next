import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import createMiddleware from "next-intl/middleware";

const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  // Match /en or /en-US or /fr-FR etc.
  const match = pathname.match(/^\/([a-z]{2,3})(?:-([A-Z]{2}))?(\/.*)?$/);
  let locale = routing.defaultLocale;
  let country: string | undefined;
  let restPath = pathname;

  if (match) {
    locale = match[1]; // e.g. 'en'
    country = match[2]; // e.g. 'US'
    restPath = match[3] || "/";
  }

  // Build normalized URL (avoid duplicate /en/en-US)
  const normalizedUrl = request.nextUrl.clone();
  normalizedUrl.pathname = `/${locale}${restPath}`;

  // Let next-intl handle locale routing
  const res = intlMiddleware(new NextRequest(normalizedUrl));

  //  Set the cookie on the same response that will be returned
  if (country) {
    res.cookies.set("country", country, { path: "/" });
  }

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
    PROTECTED_ROUTES.includes(restPath) || restPath.startsWith("/chats/");

  const isAuthRoute = AUTH_ROUTES.includes(restPath);

  // Redirect to login if accessing protected route without token
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  // Redirect logged-in users away from auth routes
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  // Return the intlMiddleware response (with country cookie)
  return res;
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
