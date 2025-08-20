import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  const PROTECTED_ROUTES = [
    "/profile",
    "/profile/my-favorites",
    "/profile/edit-profile",
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

  let isProtectedRoute = PROTECTED_ROUTES.includes(pathname);

  if (pathname.startsWith("/chats/")) {
    isProtectedRoute = true;
  }

  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
