"use client";

import { ReactNode } from "react";
import { User } from "@/types/user";
import { AuthHydration } from "./AuthHydration";

export default function AuthProvider({
  token,
  user,
  children,
}: {
  token: string | null;
  user: User | null;
  children: ReactNode;
}) {
  return (
    <>
      <AuthHydration token={token} user={user} />
      {children}
    </>
  );
}
