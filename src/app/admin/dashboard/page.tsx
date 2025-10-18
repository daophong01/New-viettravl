"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/src/store/auth";


type Overview = {
  usersCount: number;
  newUsersCount: number;
  toursCount: number;
  activeToursCount: number;
  upcomingToursCount: number;
  bookingsCount: number;
  confirmedCount: number;
  completedCount: number;
  cancelledCount: number;
  refundedCount: number;
  monthRevenue: number;
  topSelling: Array<{ id: number; title: string; bookCount: number }>;
};

export default function AdminDashboardPage() {
  const token = useAuth((s) => s.token);
  const [stats, setStats] = useState<Overview | null>(null);
  const [monthly, setMonthly] = useState<{ label: string; total: number }[]>([]);

  useEffect(() => {
    (async () => {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const [ovRes, revRes] = await Promise.all([
        fetch(`${base}/api/admin/dashboard`, { headers: { Authorization: `Bearer ${token || ""}` } }),
        fetch(`${base}/api/admin/revenue?period=monthly&limit=12`, { headers: { Authorization: `Bearer ${token || ""}` } }),
      ]);
      if (ovRes.ok) setStats(await ovRes.json());
      if (revRes.ok) setMonthly(await revRes.json());
    })();
  }, [token]);

  const maxRev = useMemo(() => Math.max(1, ...monthly.map((i) => i.total)), [monthly]);

  return (
    <div className="py-8 space-y-8">
      <h1 className="text-2xl font-bold">Bảng điều khiển tổng quan</h1>

      {!stats ? (
        <p className="text-sm">Đang tải...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="border rounded p-3">
              <div className="text-xs text-black/60">Tổng doanh thu tháng</div>
              <div className="text-xl font-semibold">{stats.monthRevenue.toLocaleString("vi-VN")} VND</div>
            </div>
            <div className="border rounded p-3">
              <div className="text-xs text-black/60">Khách hàng mới / Tổng</div>
              <div className="text-xl font-semibold">{stats.newUsersCount} / {stats.usersCount}</div>
            </div>
            <div className="border rounded p-3">
              <div className="text-xs text-black/60">Tours hoạt động / sắp diễn ra</div>
              <div className="text-xl font-semibold">{stats.activeToursCount} / {stats.upcomingToursCount}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="border rounded p-3">
              <div className="text-xs text-black/60">Đặt chỗ</div>
              <div className="text-xl font-semibold">{stats.bookingsCount}</div>
            </div>
            <div className="border rounded p-3">
              <div className="text-xs text-black/60">Đã xác nhận</div>
              <div className="text-xl font-semibold">{stats.confirmedCount}</div>
            </div>
            <div className="border rounded p-3">
              <div className="text-xs text-black/60">Hoàn thành</div>
              <div className="text-xl font-semibold">{stats.completedCount}</div>
            </div>
            <div className="border rounded p-3">
              <div className="text-xs text-black/60">Hủy / Hoàn tiền</div>
              <div className="text-xl font-semibold">{stats.cancelledCount} / {stats.refundedCount}</div>
            </div>
          </div>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Top 5 tour bán chạy nhất</h2>
            {(!stats.topSelling || stats.topSelling.length === 0) ? (
              <p className="text-sm">Chưa có dữ liệu.</p>
            ) : (
              <div className="space-y-2">
                {stats.topSelling.map((t: any) => (
                  <div key={t.id} className="flex items-center gap-2">
                    <div className="w-64 text-sm">{t.title}</div>
                    <div className="h-4 bg-foreground/20 rounded w-full">
                      <div
                        className="h-4 bg-foreground rounded"
                        style={{ width: `${(Number(t.bookCount || 0) / Math.max(1, Number(stats.topSelling[0]?.bookCount || 1))) * 100}%` }}
                        title={`${Number(t.bookCount || 0)} lượt`}
                      />
                    </div>
                    <div className="w-24 text-right text-xs">{Number(t.bookCount || 0)} lượt</div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Biểu đồ doanh thu theo tháng</h2>
            {monthly.length === 0 ? (
              <p className="text-sm">Chưa có dữ liệu.</p>
            ) : (
              <div className="space-y-2">
                {monthly.map((m) => (
                  <div key={m.label} className="flex items-center gap-2">
                    <div className="w-40 text-xs text-black/60">{m.label}</div>
                    <div className="h-4 bg-foreground/20 rounded w-full">
                      <div className="h-4 bg-foreground rounded" style={{ width: `${(m.total / maxRev) * 100}%` }} />
                    </div>
                    <div className="w-32 text-right text-xs">{m.total.toLocaleString("vi-VN")} VND</div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}