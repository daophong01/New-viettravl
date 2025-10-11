"use client";

import { useEffect } from "react";
import { useToast } from "@/src/store/toast";

function Icon({ type }: { type?: "info" | "success" | "error" }) {
  if (type === "success") return <span>✓</span>;
  if (type === "error") return <span>!</span>;
  return <span>ℹ</span>;
}

export default function ToastContainer() {
  const { toasts, remove } = useToast();

  useEffect(() => {
    const timers = toasts.map((t) => {
      if (!t.durationMs) return null;
      const id = setTimeout(() => remove(t.id), t.durationMs);
      return id;
    });
    return () => {
      timers.forEach((id) => id && clearTimeout(id));
    };
  }, [toasts, remove]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`rounded px-3 py-2 shadow border flex items-center gap-2 ${
            t.type === "success"
              ? "bg-green-100 text-green-800 border-green-300"
              : t.type === "error"
              ? "bg-red-100 text-red-800 border-red-300"
              : "bg-black/80 text-white border-black/40"
          }`}
        >
          <span className="text-sm">
            <Icon type={t.type} />
          </span>
          <span className="text-sm">{t.text}</span>
          <button
            onClick={() => remove(t.id)}
            className="ml-auto text-xs underline"
          >
            Đóng
          </button>
        </div>
      ))}
    </div>
  );
}