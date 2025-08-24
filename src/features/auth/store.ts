import { User } from "@/types/user";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthStore {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;

  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  user: null,
  token: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setToken: (token) => set({ token }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
}));

interface ResetState {
  email: string;
  clear: () => void;
  setEmail: (email: string) => void;
}

export const useResetPasswordStore = create<ResetState>()(
  persist(
    (set) => ({
      email: "",
      setEmail: (email) => set({ email }),
      clear: () => set({ email: "" }),
    }),
    {
      name: "reset-password-session",
      storage: createJSONStorage(() => sessionStorage),
    },
  )
);
