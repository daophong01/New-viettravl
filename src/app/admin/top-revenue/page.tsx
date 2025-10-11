"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/src/store/auth";

type TopRevenue = { id: number; title: string; revenueSum: number };

export default function AdminTopRevenuePage() {
  const token = useAuth((s) => s.token);
  const [items, setItems] = useState<TopRevenue[]>([]);

  useEffect(() => {
    (async () => {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const res = await fetch(`${base}/api/admin/top-revenue?limit=50`, {
        headers: { Authorization: `Bearer ${token || ""}` },
      });
      if (res.ok) {
        const rows = await res.json();
        setItems(rows.map((r: any) => ({ id: r.id, title: r.title, revenueSum: Number(r.revenueSum || 0) })));
      }
    })();
  }, [token]);

  const max = useMemo(() => Math.max(1, ...items.map((i) => i.revenueSum)), [items]);

  return (
    <div className="py-8 space-y-6">
      <h1 className="text-2xl font-bold">Top doanh thu</h1>
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
                  style={{ width: `${(i.revenueSum / max) * 100}%` }}
                  title={`${i.revenueSum.toLocaleString("vi-VN")} VND`}
                />
              </div>
              <div className="w-32 text-right text-xs">{i.revenueSum.toLocaleString("vi-VN")} VND</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}