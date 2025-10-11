"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/src/store/auth";
import { Booking, Tour, User } from "@/src/lib/types";

type BookingRow = Booking & {
  user?: User;
  tour?: Tour;
};

export default function AdminBookingsPage() {
  const token = useAuth((s) => s.token);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    (async () => {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const [bRes, tRes, uRes] = await Promise.all([
        fetch(`${base}/api/admin/bookings`, { headers: { Authorization: `Bearer ${token || ""}` } }),
        fetch(`${base}/api/tours`),
        fetch(`${base}/api/users`, { headers: { Authorization: `Bearer ${token || ""}` } }),
      ]);
      if (bRes.ok) setBookings(await bRes.json());
      if (tRes.ok) setTours(await tRes.json());
      if (uRes.ok) setUsers(await uRes.json());
    })();
  }, [token]);

  const findTour = (id: number) => tours.find((t) => t.id === id);
  const findUser = (id: number) => users.find((u) => u.id === id);

  return (
    <div className="py-8 space-y-6">
      <h1 className="text-2xl font-bold">Quản lý Bookings</h1>
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
    </div>
  );
}