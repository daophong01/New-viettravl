"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/src/store/auth";

export default function AdminDashboardPage() {
  const token = useAuth((s) => s.token);
  const [stats, setStats] = useState<{
    usersCount: number;
    toursCount: number;
    bookingsCount: number;
    reviewsCount: number;
  } | null>(null);

  useEffect(() => {
    (async () => {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const res = await fetch(`${base}/api/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token || ""}` },
      });
      if (res.ok) setStats(await res.json());
    })();
  }, [token]);

  return (
    <div className="py-8 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      {!stats ? (
        <p className="text-sm">Đang tải...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="border rounded p-3">
            <div className="text-xs text-black/60">Users</div>
            <div className="text-xl font-semibold">{stats.usersCount}</div>
          </div>
          <div className="border rounded p-3">
            <div className="text-xs text-black/60">Tours</div>
            <div className="text-xl font-semibold">{stats.toursCount}</div>
          </div>
          <div className="border rounded p-3">
            <div className="text-xs text-black/60">Bookings</div>
            <div className="text-xl font-semibold">{stats.bookingsCount}</div>
          </div>
          <div className="border rounded p-3">
            <div className="text-xs text-black/60">Reviews</div>
            <div className="text-xl font-semibold">{stats.reviewsCount}</div>
          </div>
        </div>
      )}
    </div>
  );
}