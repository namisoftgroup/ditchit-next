import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { getProfile } from "@/features/auth/actions";
import { getAllRoomsForSocket } from "@/features/chat/actions";
import { cookies } from "next/headers";
import { FilterState } from "@/features/listing/store";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { RTL_LANGUAGES } from "@/utils/constants";

import GoogleOneTapAuth from "@/features/auth/components/GoogleOneTapAuth";
import NextTopLoader from "nextjs-toploader";
import HydrateHomeFilter from "@/providers/HydrateHomeFilter";
import ProvidersContainer from "../../providers/ProvidersContainer";

import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

import "./globals.css";
import Script from "next/script";
import AiFloatButton from "@/components/aiFloatButton/AiFloatButton";

export const metadata: Metadata = {
  metadataBase: new URL("https://DitchIt.com/"),
  title: "DitchIt",
  description:
    "Buy, Sell, DitchIt - The Win-Win Marketplace. DitchIt offers a thrilling experience: list in 30 seconds, explore new arrivals daily, and connect with buyers and sellers in a secure community. Build your reputation, find hidden gems, and join millions of users shopping locally!",
  keywords: [
    "DitchIt",
    "Marketplace",
    "Buy and Sell",
    "Local Shopping",
    "Online Deals",
    "List Fast",
    "Community Marketplace",
  ],
  authors: [{ name: "DitchIt", url: "https://DitchIt.com" }],
  robots: "index, follow",
  openGraph: {
    title: "DitchIt",
    description:
      "Buy, Sell, DitchIt - The Win-Win Marketplace. DitchIt offers a thrilling experience: list in 30 seconds, explore new arrivals daily, and connect with buyers and sellers in a secure community.",
    url: "https://DitchIt.com/",
    type: "website",
    images: [
      {
        url: "/branding/store.png",
        width: 800,
        height: 600,
        alt: "DitchIt Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DitchIt",
    description:
      "Buy, Sell, DitchIt - The Win-Win Marketplace. DitchIt offers a thrilling experience: list in 30 seconds, explore new arrivals daily, and connect with buyers and sellers in a secure community.",
    images: ["/branding/store.png"],
  },
  icons: {
    icon: "/branding/fav.svg",
    apple: "/branding/fav.svg",
  },
};

// ✅ Fix: `params` should NOT be awaited (it’s a plain object)
type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validate locale
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Required for next-intl
  setRequestLocale(locale);

  const cookieStore = await cookies();

  //  Initialize location filter defaults
  const initialFilter: FilterState = {
    latitude: cookieStore.get("latitude")?.value || "39.8283",
    longitude: cookieStore.get("longitude")?.value || "-98.5795",
    zip_code: cookieStore.get("zip_code")?.value ?? "",
    address: cookieStore.get("address")?.value || "",
    delivery_method: cookieStore.get("delivery_method")?.value || "both",
    kilometers: Number(cookieStore.get("kilometers")?.value ?? 60),
  };

  //  Fetch user + chat data in parallel for performance
  const [profileRes, roomsRes, messages] = await Promise.all([
    getProfile(),
    getAllRoomsForSocket(),
    getMessages({ locale }),
  ]);

  const data = profileRes;
  const rooms = roomsRes?.data;
  const lang = locale;

  return (
    <html lang={lang} dir={RTL_LANGUAGES.includes(lang) ? "rtl" : "ltr"}>
      <body>
        <NextTopLoader showSpinner={false} color="#00a650" />
        <HydrateHomeFilter initialFilter={initialFilter} />

        <Toaster
          expand={false}
          richColors
          theme="light"
          position="bottom-right"
        />

        <ProvidersContainer
          rooms={rooms}
          locale={locale}
          messages={messages}
          data={data}
        >
          <Script
            src={`https://maps.googleapis.com/maps/api/js?key=${
              process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
            }&libraries=places&language=${lang}&region=${lang.toUpperCase()}`}
            strategy="beforeInteractive"
          />

          {!data?.token && <GoogleOneTapAuth />}

          <Header locale={lang} data={data} />
          <main className="min-h-[calc(100vh-316px)]">
            {children}
            <div className="container">

            <AiFloatButton />
            </div>
            </main>

          <audio id="notify-sound" src="/sounds/notify.mp3" preload="auto" />
          <Footer />
        </ProvidersContainer>
      </body>
    </html>
  );
}
