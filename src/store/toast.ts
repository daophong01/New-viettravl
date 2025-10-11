"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ToastMessage = {
  id: string;
  text: string;
  type?: "info" | "success" | "error";
};

type ToastState = {
  toasts: ToastMessage[];
  push: (t: Omit<ToastMessage, "id">) => void;
  remove: (id: string) => void;
  clear: () => void;
};

export const useToast = create<ToastState>()(
  persist(
    (set) => ({
      toasts: [],
      push: (t) =>
        set((s) => ({
          toasts: [...s.toasts, { id: Math.random().toString(36).slice(2), ...t }],
        })),
      remove: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
      clear: () => set({ toasts: [] }),
    }),
    { name: "travelgo-toast" }
  )
);