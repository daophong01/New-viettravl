"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/src/store/auth";

type TopTour = {
  id: number;
  title: string;
  location: string;
  price: number;
  rating: number;
  favCount: number;
};

export default function AdminTopFavoritesPage() {
  const token = useAuth((s) => s.token);
  const [items, setItems] = useState<TopTour[]>([]);

  useEffect(() => {
    (async () => {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const res = await fetch(`${base}/api/admin/top-favorites?limit=50`, {
        headers: { Authorization: `Bearer ${token || ""}` },
      });
      if (res.ok) {
        const rows = await res.json();
        setItems(rows.map((r: any) => ({ ...r, favCount: Number(r.favCount || 0) })));
      }
    })();
  }, [token]);

  return (
    <div className="py-8 space-y-6">
      <h1 className="text-2xl font-bold">Top yêu thích</h1>
      {items.length === 0 ? (
        <p className="text-sm">Chưa có dữ liệu.</p>
      ) : (
        <div className="space-y-2">
          {items.map((t) => (
            <div key={t.id} className="border rounded p-3 flex items-center justify-between">
              <div>
                <div className="font-semibold">{t.title}</div>
                <div className="text-sm text-black/70 dark:text-white/70">
                  {t.location} • ⭐ {t.rating?.toFixed?.(1) ?? t.rating}
                </div>
              </div>
              <div className="text-sm">Yêu thích: {t.favCount}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}