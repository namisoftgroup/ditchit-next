"use client";

import { ReactNode, useLayoutEffect } from "react";
import { User } from "@/types/user";
import { useAuthStore } from "@/features/auth/store";

export default function AuthProvider({
  token,
  user,
  children,
}: {
  token: string | null;
  user: User | null;
  children: ReactNode;
}) {
  const { setUser, setToken } = useAuthStore((state) => state);

  useLayoutEffect(() => {
    if (token && user) {
      setToken(token);
      setUser(user);
    }
  }, [token, user, setUser, setToken]);

  return <>{children}</>;
}
