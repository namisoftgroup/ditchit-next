// import { NextRequest, NextResponse } from "next/server";
// import { routing } from "./i18n/routing";
// import createMiddleware from "next-intl/middleware";

// const intlMiddleware = createMiddleware(routing);

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get("token")?.value;
//   const pathname = request.nextUrl.pathname;

//   const pathSegments = pathname.split("/");

//   const [, locale] = pathSegments;
//   const normalizedPath = routing.locales.includes(locale)
//     ? `/${pathSegments.slice(2).join("/")}`
//     : pathname;


//     console.log(locale);
    

//   const PROTECTED_ROUTES = [
//     "/profile",
//     "/profile/my-favorites",
//     "/profile/edit-profile",
//     "/profile/change-password",
//     "/create-post",
//     "/edit-post",
//     "/chats",

//   ];

//   const AUTH_ROUTES = [
//     "/login",
//     "/register",
//     "/reset-password",
//     "/reset-password/verify-otp",
//     // "/reset-password/new-password",

//   ];

//   // if (normalizedPath === "/reset-password/new-password") {
//   //   const verifiedReset = request.cookies.get("verifiedReset")?.value;
//   //   if (!verifiedReset) {
//   //     return NextResponse.redirect(
//   //       new URL(`/${locale}/reset-password/send-code`, request.url)
//   //     );
//   //   }
//   // }
//   const isProtectedRoute =
//     PROTECTED_ROUTES.includes(normalizedPath) ||
//     normalizedPath.startsWith("/chats/");

//   const isAuthRoute = AUTH_ROUTES.includes(normalizedPath);

//   if (isProtectedRoute && !token) {
//     return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
//   }

//   if (isAuthRoute && token) {
//     return NextResponse.redirect(new URL(`/${locale}`, request.url));
//   }


//   return intlMiddleware(request);
// }

// export const config = {
//   matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
// };

import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import createMiddleware from "next-intl/middleware";

const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  const match = pathname.match(/^\/([a-z]{2,3})(?:-([A-Z]{2}))?(\/.*)?$/);
  let locale = routing.defaultLocale;
  let country: string | undefined;
  let restPath = pathname;

  if (match) {
    locale = match[1]; // en
    country = match[2]; // US
    restPath = match[3] || "/";
  }

  if (country) {
    const res = NextResponse.next();
    res.cookies.set("country", country, { path: "/" });
  }

  const normalizedPath = routing.locales.includes(locale)
    ? restPath
    : pathname;

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
