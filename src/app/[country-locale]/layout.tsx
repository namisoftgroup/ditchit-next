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

type Props = {
  children: React.ReactNode;
  params: Promise<{ "country-locale": string }>;
};

export default async function RootLayout({ children, params }: Props) {
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

  const { "country-locale": fullLocale } = await params;
  const lang = fullLocale.split("-")[0];

  if (!hasLocale(routing.locales, fullLocale)) {
    notFound();
  }

  setRequestLocale(fullLocale);
  const messages = await getMessages({ locale: lang });

  return (
    <html lang={lang} dir={RTL_LANGUAGES?.includes(lang) ? "rtl" : "ltr"}>
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
          locale={fullLocale}
          messages={messages}
          data={data}
        >
          {!data.token && <GoogleOneTapAuth />}
          <Header locale={lang} data={data} />
          <main className="min-h-[calc(100vh-316px)]">{children}</main>
          <audio id="notify-sound" src="/sounds/notify.mp3" preload="auto" />
          <Footer />
        </ProvidersContainer>
      </body>
    </html>
  );
}
