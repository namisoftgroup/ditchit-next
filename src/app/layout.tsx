import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

import "./globals.css";
import MainProviders from "@/providers/MainProviders";

export const metadata: Metadata = {
  metadataBase: new URL("https://ditchit.com/"),
  title: "DitchIt",
  description:
    "Buy, Sell, Ditchit - The Win-Win Marketplace. Ditchit offers a thrilling experience: list in 30 seconds, explore new arrivals daily, and connect with buyers and sellers in a secure community. Build your reputation, find hidden gems, and join millions of users shopping locally!",
  keywords: [
    "Ditchit",
    "Marketplace",
    "Buy and Sell",
    "Local Shopping",
    "Online Deals",
    "List Fast",
    "Community Marketplace",
  ],
  authors: [{ name: "DitchIt", url: "https://ditchit.com" }],
  robots: "index, follow",
  openGraph: {
    title: "DitchIt",
    description:
      "Buy, Sell, Ditchit - The Win-Win Marketplace. Ditchit offers a thrilling experience: list in 30 seconds, explore new arrivals daily, and connect with buyers and sellers in a secure community. Build your reputation, find hidden gems, and join millions of users shopping locally!",
    url: "https://ditchit.com/",
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
      "Buy, Sell, Ditchit - The Win-Win Marketplace. Ditchit offers a thrilling experience: list in 30 seconds, explore new arrivals daily, and connect with buyers and sellers in a secure community.",
    images: ["/branding/store.png"],
  },
  icons: {
    icon: "/branding/fav.svg",
    apple: "/branding/fav.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MainProviders>
          <Header />
          <main className="min-h-[calc(100vh-126px)]">{children}</main>
          <Footer />
        </MainProviders>
      </body>
    </html>
  );
}
