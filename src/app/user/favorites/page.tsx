"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/src/store/auth";
import { Tour } from "@/src/lib/types";
import Link from "next/link";
import { useToast } from "@/src/store/toast";

export default function UserFavoritesPage() {
  const token = useAuth((s) => s.token);
  const [tours, setTours] = useState<Tour[]>([]);
  const push = useToast((s) => s.push);

  const load = async () => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const res = await fetch(`${base}/api/favorites/tours`, {
      headers: { Authorization: `Bearer ${token || ""}` },
    });
    if (res.ok) setTours(await res.json());
  };

  const removeFav = async (tourId: number) => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const res = await fetch(`${base}/api/favorites/${tourId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token || ""}` },
    });
    if (res.ok) {
      window.dispatchEvent(new CustomEvent("fav-changed", { detail: { delta: -1 } }));
      push({ text: "Đã bỏ khỏi yêu thích", type: "success" });
      await load();
    } else {
      const err = await res.json().catch(() => ({}));
      push({ text: err.error || "Thao tác thất bại", type: "error" });
    }
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
              <div className="flex items-center gap-2">
                <Link
                  href={`/tours/${t.id}`}
                  className="px-3 py-1 rounded border hover:bg-black/5 text-sm inline-block"
                >
                  Xem chi tiết
                </Link>
                <button
                  onClick={() => removeFav(t.id)}
                  className="px-3 py-1 rounded border hover:bg-red-100 text-sm"
                >
                  Bỏ yêu thích
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}