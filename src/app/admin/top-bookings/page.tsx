"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/src/store/auth";

type TopBooking = { id: number; title: string; bookCount: number };

export default function AdminTopBookingsPage() {
  const token = useAuth((s) => s.token);
  const [items, setItems] = useState<TopBooking[]>([]);

  useEffect(() => {
    (async () => {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const res = await fetch(`${base}/api/admin/top-bookings?limit=50`, {
        headers: { Authorization: `Bearer ${token || ""}` },
      });
      if (res.ok) {
        const rows = await res.json();
        setItems(rows.map((r: any) => ({ id: r.id, title: r.title, bookCount: Number(r.bookCount || 0) })));
      }
    })();
  }, [token]);

  const max = useMemo(() => Math.max(1, ...items.map((i) => i.bookCount)), [items]);

  return (
    <div className="py-8 space-y-6">
      <h1 className="text-2xl font-bold">Top đặt nhiều nhất</h1>
      {items.length === 0 ? (
        <p className="text-sm">Chưa có dữ liệu.</p>
      ) : (
        <div className="space-y-2">
          {items.map((i) => (
            <div key={i.id} className="flex items-center gap-2">
              <div className="w-64 text-sm">{i.title}</div>
              <div className="h-4 bg-foreground/20 rounded w-full">
                <div
                  className="h-4 bg-foreground rounded"
                  style={{ width: `${(i.bookCount / max) * 100}%` }}
                  title={`${i.bookCount} lượt đặt`}
                />
              </div>
              <div className="w-24 text-right text-xs">{i.bookCount} lượt</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}