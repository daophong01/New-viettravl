"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/src/store/auth";

type StatItem = { label: string; total: number };
type TopItem = { id: number; title: string; value: number };

function Bar({ label, value, max, suffix }: { label: string; value: number; max: number; suffix?: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-40 text-xs text-black/60">{label}</div>
      <div className="h-4 bg-foreground/20 rounded w-full">
        <div
          className="h-4 bg-foreground rounded"
          style={{ width: `${(value / Math.max(1, max)) * 100}%` }}
          title={`${value.toLocaleString("vi-VN")} ${suffix || ""}`}
        />
      </div>
      <div className="w-32 text-right text-xs">
        {value.toLocaleString("vi-VN")} {suffix || ""}
      </div>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const token = useAuth((s) => s.token);
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");
  const [revenue, setRevenue] = useState<StatItem[]>([]);
  const [topBookings, setTopBookings] = useState<TopItem[]>([]);
  const [topRevenue, setTopRevenue] = useState<TopItem[]>([]);
  const [topFavorites, setTopFavorites] = useState<TopItem[]>([]);

  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  const loadAll = async () => {
    const [revRes, bookRes, revTopRes, favRes] = await Promise.all([
      fetch(`${base}/api/admin/revenue?period=${period}&limit=30`, { headers: { Authorization: `Bearer ${token || ""}` } }),
      fetch(`${base}/api/admin/top-bookings?limit=20`, { headers: { Authorization: `Bearer ${token || ""}` } }),
      fetch(`${base}/api/admin/top-revenue?limit=20`, { headers: { Authorization: `Bearer ${token || ""}` } }),
      fetch(`${base}/api/admin/top-favorites?limit=20`, { headers: { Authorization: `Bearer ${token || ""}` } }),
    ]);
    if (revRes.ok) setRevenue(await revRes.json());
    if (bookRes.ok) {
      const rows = await bookRes.json();
      setTopBookings(rows.map((r: any) => ({ id: r.id, title: r.title, value: Number(r.bookCount || 0) })));
    }
    if (revTopRes.ok) {
      const rows = await revTopRes.json();
      setTopRevenue(rows.map((r: any) => ({ id: r.id, title: r.title, value: Number(r.revenueSum || 0) })));
    }
    if (favRes.ok) {
      const rows = await favRes.json();
      setTopFavorites(rows.map((r: any) => ({ id: r.id, title: r.title, value: Number(r.favCount || 0) })));
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, token]);

  const maxRev = useMemo(() => Math.max(1, ...revenue.map((i) => i.total)), [revenue]);
  const maxBook = useMemo(() => Math.max(1, ...topBookings.map((i) => i.value)), [topBookings]);
  const maxRevTop = useMemo(() => Math.max(1, ...topRevenue.map((i) => i.value)), [topRevenue]);
  const maxFav = useMemo(() => Math.max(1, ...topFavorites.map((i) => i.value)), [topFavorites]);

  return (
    <div className="py-8 space-y-8">
      <h1 className="text-2xl font-bold">Analytics tổng hợp</h1>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <label className="text-sm">Chu kỳ doanh thu:</label>
          <select className="border rounded px-3 py-2" value={period} onChange={(e) => setPeriod(e.target.value as any)}>
            <option value="daily">Theo ngày</option>
            <option value="weekly">Theo tuần</option>
            <option value="monthly">Theo tháng</option>
          </select>
          <a
            className="ml-auto text-sm underline"
            href={`${base}/api/admin/export/top-bookings?format=csv`}
            target="_blank"
            rel="noreferrer"
          >
            Export Top bookings (CSV)
          </a>
          <a className="text-sm underline" href={`${base}/api/admin/export/top-bookings?format=xlsx`} target="_blank" rel="noreferrer">
            XLSX
          </a>
          <span className="mx-2">|</span>
          <a className="text-sm underline" href={`${base}/api/admin/export/top-revenue?format=csv`} target="_blank" rel="noreferrer">
            Export Top revenue (CSV)
          </a>
          <a className="text-sm underline" href={`${base}/api/admin/export/top-revenue?format=xlsx`} target="_blank" rel="noreferrer">
            XLSX
          </a>
        </div>
        {revenue.length === 0 ? (
          <p className="text-sm">Chưa có dữ liệu doanh thu.</p>
        ) : (
          <div className="space-y-2">
            {revenue.map((i) => (
              <Bar key={i.label} label={i.label} value={i.total} max={maxRev} suffix="VND" />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Top đặt nhiều nhất</h2>
        {topBookings.length === 0 ? (
          <p className="text-sm">Chưa có dữ liệu.</p>
        ) : (
          <div className="space-y-2">
            {topBookings.map((i) => (
              <Bar key={i.id} label={i.title} value={i.value} max={maxBook} suffix="lượt" />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Top doanh thu</h2>
        {topRevenue.length === 0 ? (
          <p className="text-sm">Chưa có dữ liệu.</p>
        ) : (
          <div className="space-y-2">
            {topRevenue.map((i) => (
              <Bar key={i.id} label={i.title} value={i.value} max={maxRevTop} suffix="VND" />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Top yêu thích</h2>
        {topFavorites.length === 0 ? (
          <p className="text-sm">Chưa có dữ liệu.</p>
        ) : (
          <div className="space-y-2">
            {topFavorites.map((i) => (
              <Bar key={i.id} label={i.title} value={i.value} max={maxFav} suffix="lượt" />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}