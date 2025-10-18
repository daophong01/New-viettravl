"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/src/store/auth";
import { Booking, Tour } from "@/src/lib/types";

export default function UserDashboard() {
  const user = useAuth((s) => s.user);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);

  useEffect(() => {
    (async () => {
      const [bRes, tRes] = await Promise.all([fetch("/api/bookings"), fetch("/api/tours")]);
      if (bRes.ok) setBookings(await bRes.json());
      if (tRes.ok) setTours(await tRes.json());
    })();
  }, []);

  const myBookings = bookings.filter((b) => b.userId === (user?.id ?? 1));

  const tourById = (id: number) => tours.find((t) => t.id === id);

  return (
    <div className="py-8 space-y-4">
      <h1 className="text-2xl font-bold">Lịch sử đặt tour</h1>
      {!user && (
        <p className="text-sm text-black/70 dark:text-white/70">
          Bạn chưa đăng nhập, đang hiển thị dữ liệu demo của user #1.
        </p>
      )}
      {myBookings.length === 0 ? (
        <p className="text-sm">Chưa có đặt tour</p>
      ) : (
        <div className="space-y-3">
          {myBookings.map((b) => (
            <div key={b.id} className="border rounded p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Mã đặt: {b.id}</span>
                <span className="text-xs text-black/60 dark:text-white/60">
                  {new Date(b.createdAt).toLocaleString("vi-VN")}
                </span>
              </div>
              <p className="text-sm">Trạng thái: {b.status}</p>
              <p className="text-sm">
                Tour: {tourById(b.tourId)?.title || `#${b.tourId}`}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}