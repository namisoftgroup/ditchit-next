"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { NextIntlClientProvider, AbstractIntlMessages } from "next-intl";
import { Room } from "@/features/chat/types";
import { User } from "@/types/user";
import React, { useEffect } from "react";
import AuthProvider from "./AuthProvider";
import ReactQueryProvider from "./ReactQueryProvider";
import WebSocketProvider from "./WebSocketProvider";

type ProvidersProps = {
  children: React.ReactNode;
  locale: string;
  rooms: Room[];
  messages: AbstractIntlMessages;
  data: {
    user: User | null;
    token: string | null;
  };
};

export default function ProvidersContainer({
  children,
  locale,
  messages,
  rooms,
  data,
}: ProvidersProps) {
  useEffect(() => {
    const audio = document.getElementById("notify-audio") as HTMLAudioElement;

    const unlock = () => {
      if (!audio) return;
      audio.muted = true;
      audio.play().then(() => {
        audio.pause();
        audio.muted = false;
        audio.currentTime = 0;
        document.removeEventListener("click", unlock);
        document.removeEventListener("keydown", unlock);
      });
    };

    document.addEventListener("click", unlock);
    document.addEventListener("keydown", unlock);

    return () => {
      document.removeEventListener("click", unlock);
      document.removeEventListener("keydown", unlock);
    };
  }, []);

  return (
    <NextIntlClientProvider
      locale={locale}
      timeZone="UTC"
      now={new Date()}
      messages={messages}
    >
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
        <AuthProvider user={data?.user ?? null} token={data?.token ?? null}>
          <ReactQueryProvider>
            <WebSocketProvider rooms={rooms}>{children}</WebSocketProvider>
          </ReactQueryProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </NextIntlClientProvider>
  );
}
