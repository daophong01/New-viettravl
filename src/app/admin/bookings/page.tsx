"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/src/store/auth";
import { Booking, Tour, User } from "@/src/lib/types";

type BookingRow = Booking & {
  user?: User;
  tour?: Tour;
};

import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminBookingsPage() {
  const token = useAuth((s) => s.token);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState<"id_desc" | "id_asc" | "date_desc" | "date_asc">("id_desc");

  const load = async () => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const [bRes, tRes, uRes] = await Promise.all([
      fetch(`${base}/api/admin/bookings?page=${page}&pageSize=${pageSize}&sort=${sort}`, { headers: { Authorization: `Bearer ${token || ""}` } }),
      fetch(`${base}/api/tours?page=1&pageSize=100`),
      fetch(`${base}/api/users?page=1&pageSize=100`, { headers: { Authorization: `Bearer ${token || ""}` } }),
    ]);
    if (bRes.ok) {
      const data = await bRes.json();
      setBookings(data.items || []);
      setTotal(data.total || 0);
    }
    if (tRes.ok) {
      const data = await tRes.json();
      setTours(Array.isArray(data) ? data : data.items || []);
    }
    if (uRes.ok) {
      const data = await uRes.json();
      setUsers(data.items || data || []);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, page, sort]);

  const findTour = (id: number) => tours.find((t) => t.id === id);
  const findUser = (id: number) => users.find((u) => u.id === id);

  return (
    <div className="py-8 space-y-6">
      <h1 className="text-2xl font-bold">Quản lý Bookings</h1>

      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2">
          <select
            className="border rounded px-3 py-2"
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
          >
            <option value="id_desc">ID mới nhất</option>
            <option value="id_asc">ID cũ nhất</option>
            <option value="date_desc">Ngày mới nhất</option>
            <option value="date_asc">Ngày cũ nhất</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={(process.env.NEXT_PUBLIC_API_BASE_URL || "") + "/api/admin/export/bookings"}
            className="px-3 py-1 rounded bg-foreground text-background text-sm hover:opacity-90"
          >
            Xuất CSV
          </a>
          <a
            href={(process.env.NEXT_PUBLIC_API_BASE_URL || "") + "/api/admin/export/bookings?format=xlsx"}
            className="px-3 py-1 rounded border text-sm hover:bg-black/5"
          >
            Xuất Excel
          </a>
        </div>
      </div>

      <div className="space-y-2">
        {bookings.length === 0 ? (
          <p className="text-sm">Chưa có bookings</p>
        ) : (
          bookings.map((b) => (
            <div key={b.id} className="border rounded p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Mã đặt: {b.id}</span>
                <span className="text-xs text-black/60 dark:text-white/60">
                  {b.createdAt ? new Date(b.createdAt).toLocaleString("vi-VN") : ""}
                </span>
              </div>
              <p className="text-sm">Trạng thái: {b.status}</p>
              <p className="text-sm">Người dùng: {findUser(b.userId)?.email || `#${b.userId}`}</p>
              <p className="text-sm">Tour: {findTour(b.tourId)?.title || `#${b.tourId}`}</p>
            </div>
          ))
        )}
      </div>

      <div className="flex items-center justify-center gap-2">
        <button
          className="px-3 py-1 rounded border hover:bg-black/5"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Trang trước
        </button>
        <span className="text-sm">
          {page} / {Math.max(1, Math.ceil(total / pageSize))}
        </span>
        <button
          className="px-3 py-1 rounded border hover:bg-black/5"
          onClick={() => setPage((p) => Math.min(Math.max(1, Math.ceil(total / pageSize)), p + 1))}
          disabled={page >= Math.ceil(total / pageSize)}
        >
          Trang sau
        </button>
      </div>
    </div>
  );
}