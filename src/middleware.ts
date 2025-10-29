// import { NextRequest, NextResponse } from "next/server";
// import { routing } from "./i18n/routing";
// import createMiddleware from "next-intl/middleware";

// const intlMiddleware = createMiddleware(routing);

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get("token")?.value;
//   const pathname = request.nextUrl.pathname;
//   console.log(pathname);

//   if (pathname === "/") {
//     const localeCookie = request.cookies.get("NEXT_LOCALE")?.value;
//     const countryCookie = request.cookies.get("country")?.value;

//     const locale = localeCookie || routing.defaultLocale;
//     const country = countryCookie || "US";

//     const redirectUrl = new URL(`/${locale}-${country}/`, request.url);
//     return NextResponse.redirect(redirectUrl);
//   }

//   //  Match /en or /en-US or /fr-FR etc.
//   const match = pathname.match(/^\/([a-z]{2,3})(?:-([A-Z]{2}))?(\/.*)?$/);
//   let locale = routing.defaultLocale;
//   let country: string | undefined;
//   let restPath = pathname;

//   if (match) {
//     locale = match[1];
//     country = match[2];
//     restPath = match[3] || "/";
//   }

//   //  Normalize URL for intlMiddleware
//   const normalizedUrl = request.nextUrl.clone();
//   normalizedUrl.pathname = `/${locale}${restPath}`;

//   // Run intl middleware
//   const res = intlMiddleware(new NextRequest(normalizedUrl));

//   //  Set the country cookie if available
//   if (country) {
//     res.cookies.set("country", country, {
//       path: "/",
//       maxAge: 60 * 60 * 24 * 365,
//     });
//   }

//   //  Auth & Protected routes
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
//   ];

//   const isProtectedRoute =
//     PROTECTED_ROUTES.includes(restPath) || restPath.startsWith("/chats/");
//   const isAuthRoute = AUTH_ROUTES.includes(restPath);

//   if (isProtectedRoute && !token) {
//     return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
//   }

//   if (isAuthRoute && token) {
//     return NextResponse.redirect(new URL(`/${locale}`, request.url));
//   }

//   //  Return intlMiddleware response (with cookie)
//   return res;
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

  // --- STEP 1: handle root "/" ---
  if (pathname === "/") {
    const localeCookie = request.cookies.get("NEXT_LOCALE")?.value;
    const countryCookie = request.cookies.get("country")?.value;

    const locale = localeCookie || routing.defaultLocale;
    const country = countryCookie || "US";

    const redirectUrl = new URL(`/${locale}-${country}/`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // --- STEP 2: parse locale and country from path ---
  const match = pathname.match(/^\/([a-z]{2,3})(?:-([A-Z]{2}))?(\/.*)?$/);
  let locale = routing.defaultLocale;
  let country: string | undefined;
  let restPath = pathname;

  if (match) {
    locale = match[1]; // e.g. "en"
    country = match[2]; // e.g. "US"
    restPath = match[3] || "/";
  }

  // --- STEP 3: if only locale (no country), redirect to locale-country ---
  if (match && locale && !country) {
    const countryCookie = request.cookies.get("country")?.value || "US";
    const redirectUrl = new URL(
      `/${locale}-${countryCookie}${restPath}`,
      request.url
    );
    return NextResponse.redirect(redirectUrl);
  }

  // --- STEP 4: normalize for next-intl ---
  const normalizedUrl = request.nextUrl.clone();
  normalizedUrl.pathname = `/${locale}${restPath}`;
  const res = intlMiddleware(new NextRequest(normalizedUrl));

  // --- STEP 5: set country cookie if present ---
  if (country) {
    res.cookies.set("country", country, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  }

  // --- STEP 6: Auth & Protected route logic ---
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

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  // --- STEP 7: return final response ---
  return res;
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
