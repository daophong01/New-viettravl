"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/src/store/auth";
import { Tour } from "@/src/lib/types";
import Link from "next/link";

export default function UserFavoritesPage() {
  const token = useAuth((s) => s.token);
  const [tours, setTours] = useState<Tour[]>([]);

  const load = async () => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const res = await fetch(`${base}/api/favorites/tours`, {
      headers: { Authorization: `Bearer ${token || ""}` },
    });
    if (res.ok) setTours(await res.json());
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="py-8 space-y-6">
      <h1 className="text-2xl font-bold">Yêu thích của tôi</h1>
      {tours.length === 0 ? (
        <p className="text-sm">Chưa có tour yêu thích. Hãy thêm từ trang danh sách hoặc chi tiết tour.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tours.map((t) => (
            <div key={t.id} className="border rounded p-3 space-y-2">
              <strong>{t.title}</strong>
              <div className="text-sm text-black/70 dark:text-white/70">{t.location}</div>
              <div className="text-sm">{t.duration}</div>
              <div className="text-sm">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(t.price)}
              </div>
              <Link
                href={`/tours/${t.id}`}
                className="px-3 py-1 rounded border hover:bg-black/5 text-sm inline-block"
              >
                Xem chi tiết
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}