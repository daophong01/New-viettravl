"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/src/store/auth";
import { Review, Tour, User } from "@/src/lib/types";

export default function AdminReviewsPage() {
  const token = useAuth((s) => s.token);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const load = async () => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const [rRes, tRes, uRes] = await Promise.all([
      fetch(`${base}/api/admin/reviews`, { headers: { Authorization: `Bearer ${token || ""}` } }),
      fetch(`${base}/api/tours`),
      fetch(`${base}/api/users`, { headers: { Authorization: `Bearer ${token || ""}` } }),
    ]);
    if (rRes.ok) setReviews(await rRes.json());
    if (tRes.ok) setTours(await tRes.json());
    if (uRes.ok) setUsers(await uRes.json());
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const tourTitle = (id: number) => tours.find((t) => t.id === id)?.title || `#${id}`;
  const userEmail = (id: number) => users.find((u) => u.id === id)?.email || `#${id}`;

  return (
    <div className="py-8 space-y-6">
      <h1 className="text-2xl font-bold">Quản lý Reviews</h1>
      <div className="space-y-2">
        {reviews.length === 0 ? (
          <p className="text-sm">Chưa có reviews</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="border rounded p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">⭐ {r.rating}</span>
                <span className="text-xs text-black/60 dark:text-white/60">
                  {r.createdAt ? new Date(r.createdAt).toLocaleString("vi-VN") : ""}
                </span>
              </div>
              <p className="text-sm">Người dùng: {userEmail(r.userId)}</p>
              <p className="text-sm">Tour: {tourTitle(r.tourId)}</p>
              <p className="text-sm mt-2">{r.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}