import { Toaster } from "@/components/ui/sonner";
import { getProfile } from "@/features/auth/actions";
import { getAllRoomsForSocket } from "@/features/chat/actions";
import { cookies } from "next/headers";
import { FilterState } from "@/features/listing/store";
import { getMessages, setRequestLocale } from "next-intl/server";
import { RTL_LANGUAGES } from "@/utils/constants";
import type { Metadata } from "next";
import GoogleOneTapAuth from "@/features/auth/components/GoogleOneTapAuth";
import NextTopLoader from "nextjs-toploader";
import HydrateHomeFilter from "@/providers/HydrateHomeFilter";
import ProvidersContainer from "../../providers/ProvidersContainer";

import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

import "./globals.css";

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
      "Buy, Sell, DitchIt - The Win-Win Marketplace. DitchIt offers a thrilling experience: list in 30 seconds, explore new arrivals daily, and connect with buyers and sellers in a secure community. Build your reputation, find hidden gems, and join millions of users shopping locally!",
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

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const cookieStore = await cookies();

  const initialFilter: FilterState = {
    latitude: cookieStore.get("latitude")?.value || "39.8283",
    longitude: cookieStore.get("longitude")?.value || "-98.5795",
    zip_code: cookieStore.get("zip_code")?.value ?? "20500",
    address: cookieStore.get("address")?.value || "United States",
    delivery_method: cookieStore.get("delivery_method")?.value || "both",
    kilometers: Number(cookieStore.get("kilometers")?.value ?? 0),
  };

  const data = await getProfile();
  const { data: rooms } = await getAllRoomsForSocket();

  const locale = (await params).locale;

  if (locale) {
    setRequestLocale(locale);
  }
  const messages = await getMessages({ locale: locale });

  return (
    <html lang={locale} dir={RTL_LANGUAGES.includes(locale) ? "rtl" : "ltr"}>
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
          {!data.token && <GoogleOneTapAuth />}
          <Header locale={locale} />
          <main className="min-h-[calc(100vh-316px)]">{children}</main>
          <Footer />
        </ProvidersContainer>
      </body>
    </html>
  );
}
