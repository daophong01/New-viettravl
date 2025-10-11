"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/src/store/auth";

type Datum = { label: string; total: number };

export default function AdminRevenuePage() {
  const token = useAuth((s) => s.token);
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");
  const [items, setItems] = useState<Datum[]>([]);

  const load = async () => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const res = await fetch(`${base}/api/admin/revenue?period=${period}&limit=30`, {
      headers: { Authorization: `Bearer ${token || ""}` },
    });
    if (res.ok) setItems(await res.json());
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, token]);

  const max = useMemo(() => Math.max(1, ...items.map((i) => i.total)), [items]);

  return (
    <div className="py-8 space-y-6">
      <h1 className="text-2xl font-bold">Thống kê doanh thu</h1>
      <div className="flex items-center gap-2">
        <label className="text-sm">Chu kỳ:</label>
        <select
          className="border rounded px-3 py-2"
          value={period}
          onChange={(e) => setPeriod(e.target.value as any)}
        >
          <option value="daily">Theo ngày</option>
          <option value="weekly">Theo tuần</option>
          <option value="monthly">Theo tháng</option>
        </select>
      </div>

      {items.length === 0 ? (
        <p className="text-sm">Chưa có dữ liệu.</p>
      ) : (
        <div className="space-y-2">
          {items.map((i) => (
            <div key={i.label} className="flex items-center gap-2">
              <div className="w-40 text-xs text-black/60">{i.label}</div>
              <div className="h-4 bg-foreground/20 rounded w-full">
                <div
                  className="h-4 bg-foreground rounded"
                  style={{ width: `${(i.total / max) * 100}%` }}
                  title={`${i.total.toLocaleString("vi-VN")} VND`}
                />
              </div>
              <div className="w-32 text-right text-xs">{i.total.toLocaleString("vi-VN")} VND</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}