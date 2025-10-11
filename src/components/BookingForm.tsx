"use client";

import { useState } from "react";
import { useAuth } from "@/src/store/auth";

export default function BookingForm({ tourId }: { tourId: number }) {
  const user = useAuth((s) => s.user);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const book = async () => {
    setLoading(true);
    setMessage(null);
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user?.id ?? 1, tourId }),
    });
    setLoading(false);
    if (res.ok) {
      setMessage("Đặt tour thành công!");
    } else {
      const err = await res.json().catch(() => ({}));
      setMessage(err?.error || "Có lỗi xảy ra");
    }
  };

  return (
    <div className="mt-4 space-y-2">
      {!user && (
        <p className="text-sm text-black/70 dark:text-white/70">
          Vui lòng đăng nhập để đặt tour (hệ thống sẽ tạm dùng user mặc định).
        </p>
      )}
      <button
        onClick={book}
        disabled={loading}
        className="px-4 py-2 rounded bg-foreground text-background disabled:opacity-50"
      >
        {loading ? "Đang xử lý..." : "Đặt ngay"}
      </button>
      {message && <p className="text-sm">{message}</p>}
    </div>
  );
}