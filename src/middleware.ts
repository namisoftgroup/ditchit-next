import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import createMiddleware from "next-intl/middleware";

const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  const pathSegments = pathname.split("/");

  const [, locale] = pathSegments;
  const normalizedPath = routing.locales.includes(locale)
    ? `/${pathSegments.slice(2).join("/")}`
    : pathname;

  const PROTECTED_ROUTES = [
    "/profile",
    "/profile/my-favorites",
    "/profile/edit-profile",
    "/profile/change-password",
    "/create-post",
    "/edit-post",
    "/chats",
    "/reset-password/new-password",
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

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
