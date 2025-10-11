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
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const load = async () => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const qs = new URLSearchParams({
      limit: "50",
      ...(startDate ? { startDate } : {}),
      ...(endDate ? { endDate } : {}),
    }).toString();
    const res = await fetch(`${base}/api/admin/top-favorites?${qs}`, {
      headers: { Authorization: `Bearer ${token || ""}` },
    });
    if (res.ok) {
      const rows = await res.json();
      setItems(rows.map((r: any) => ({ ...r, favCount: Number(r.favCount || 0) })));
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, startDate, endDate]);

  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  return (
    <div className="py-8 space-y-6">
      <h1 className="text-2xl font-bold">Top yêu thích</h1>

      <div className="flex items-center gap-2 flex-wrap">
        <label className="text-sm">Từ ngày:</label>
        <input type="date" className="border rounded px-3 py-2" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <label className="text-sm">Đến ngày:</label>
        <input type="date" className="border rounded px-3 py-2" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <button onClick={load} className="px-3 py-2 rounded border hover:bg-black/5">Lọc</button>
        <span className="mx-2">|</span>
        <a
          className="text-sm underline"
          href={`${base}/api/admin/export/top-favorites?format=csv${startDate ? `&startDate=${startDate}` : ""}${endDate ? `&endDate=${endDate}` : ""}`}
          target="_blank"
          rel="noreferrer"
        >
          Export CSV
        </a>
        <a
          className="text-sm underline"
          href={`${base}/api/admin/export/top-favorites?format=xlsx${startDate ? `&startDate=${startDate}` : ""}${endDate ? `&endDate=${endDate}` : ""}`}
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
          {items.map((t) => (
            <div key={t.id} className="border rounded p-3 flex items-center justify-between">
              <div>
                <div className="font-semibold">{t.title}</div>
                <div className="text-sm text-black/70 dark:text.white/70">
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