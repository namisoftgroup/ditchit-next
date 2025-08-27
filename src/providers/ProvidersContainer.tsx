import { GoogleOAuthProvider } from "@react-oauth/google";
import { NextIntlClientProvider, AbstractIntlMessages } from "next-intl";
import { Room } from "@/features/chat/types";
import { User } from "@/types/user";
import React from "react";
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
  return (
    <NextIntlClientProvider
      locale={locale}
      timeZone="UTC"
      now={new Date()}
      messages={messages}
    >
      <GoogleOAuthProvider clientId={process.env.NEXT_GOOGLE_CLIENT_ID!}>
        <AuthProvider user={data?.user ?? null} token={data?.token ?? null}>
          <ReactQueryProvider>
            <WebSocketProvider rooms={rooms}>{children}</WebSocketProvider>
          </ReactQueryProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </NextIntlClientProvider>
  );
}
