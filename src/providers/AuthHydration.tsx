"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/store";
import { User } from "@/types/user";

export function AuthHydration({
  token,
  user,
}: {
  token: string | null;
  user: User | null;
}) {
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);

  useEffect(() => {
    if (token && user) {
      setToken(token);
      setUser(user);
    }
  }, [token, user, setUser, setToken]);

  return null;
}
