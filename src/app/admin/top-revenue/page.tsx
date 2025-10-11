"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/src/store/auth";

type TopRevenue = { id: number; title: string; revenueSum: number };

export default function AdminTopRevenuePage() {
  const token = useAuth((s) => s.token);
  const [items, setItems] = useState<TopRevenue[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const load = async () => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const qs = new URLSearchParams({
      limit: "50",
      ...(startDate ? { startDate } : {}),
      ...(endDate ? { endDate } : {}),
    }).toString();
    const res = await fetch(`${base}/api/admin/top-revenue?${qs}`, {
      headers: { Authorization: `Bearer ${token || ""}` },
    });
    if (res.ok) {
      const rows = await res.json();
      setItems(rows.map((r: any) => ({ id: r.id, title: r.title, revenueSum: Number(r.revenueSum || 0) })));
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, startDate, endDate]);

  const max = useMemo(() => Math.max(1, ...items.map((i) => i.revenueSum)), [items]);
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  return (
    <div className="py-8 space-y-6">
      <h1 className="text-2xl font-bold">Top doanh thu</h1>

      <div className="flex items-center gap-2 flex-wrap">
        <label className="text-sm">Từ ngày:</label>
        <input type="date" className="border rounded px-3 py-2" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <label className="text-sm">Đến ngày:</label>
        <input type="date" className="border rounded px-3 py-2" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <button onClick={load} className="px-3 py-2 rounded border hover:bg-black/5">Lọc</button>
        <span className="mx-2">|</span>
        <a
          className="text-sm underline"
          href={`${base}/api/admin/export/top-revenue?format=csv${startDate ? `&startDate=${startDate}` : ""}${endDate ? `&endDate=${endDate}` : ""}`}
          target="_blank"
          rel="noreferrer"
        >
          Export CSV
        </a>
        <a
          className="text-sm underline"
          href={`${base}/api/admin/export/top-revenue?format=xlsx${startDate ? `&startDate=${startDate}` : ""}${endDate ? `&endDate=${endDate}` : ""}`}
          target="_blank"
          rel="noreferrer"
        >
          XLSX
        </a>
      </div>

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