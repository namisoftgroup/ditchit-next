import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { getProfile } from "@/features/auth/actions";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleOneTapAuth from "@/features/auth/components/GoogleOneTapAuth";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import AuthProvider from "@/providers/AuthProvider";
import NextTopLoader from "nextjs-toploader";
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await getProfile();

  return (
    <html lang="en">
      <body>
        <NextTopLoader showSpinner={false} color="#00a650" />

        <GoogleOAuthProvider clientId={process.env.NEXT_GOOGLE_CLIENT_ID!}>
          <AuthProvider user={data?.user ?? null} token={data?.token ?? null}>
            <ReactQueryProvider>
              <Toaster
                expand={false}
                richColors
                position="bottom-right"
                theme="light"
              />

              {!data.token && <GoogleOneTapAuth />}

              <Header />
              <main className="min-h-[calc(100vh-316px)]">{children}</main>
              <Footer />
            </ReactQueryProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
