"use client";

import { useToast } from "@/src/store/toast";

export default function ToastContainer() {
  const { toasts, remove } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`rounded px-3 py-2 shadow border ${
            t.type === "success"
              ? "bg-green-100 text-green-800"
              : t.type === "error"
              ? "bg-red-100 text-red-800"
              : "bg-black/80 text-white"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm">{t.text}</span>
            <button
              onClick={() => remove(t.id)}
              className="ml-auto text-xs underline"
            >
              Đóng
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}