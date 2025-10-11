"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/src/lib/types";

interface AuthState {
  user: User | null;
  token: string | null;
  login: (payload: { user: User; token: string }) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: ({ user, token }) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: "travelgo-auth" }
  )
);