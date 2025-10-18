"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/src/store/auth";
import { Review, Tour, User } from "@/src/lib/types";
import ConfirmDialog from "@/src/components/ConfirmDialog";
import { useToast } from "@/src/store/toast";

import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminReviewsPage() {
  const token = useAuth((s) => s.token);
  const push = useToast((s) => s.push);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  // Filters
  const [tourId, setTourId] = useState<number | "all">("all");
  const [userQuery, setUserQuery] = useState("");
  const [ratingMin, setRatingMin] = useState<number | undefined>(undefined);
  const [ratingMax, setRatingMax] = useState<number | undefined>(undefined);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState<"id_desc" | "id_asc" | "date_desc" | "date_asc" | "rating_desc" | "rating_asc">("id_desc");

  const load = async () => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const [rRes, tRes, uRes] = await Promise.all([
      fetch(`${base}/api/admin/reviews?page=${page}&pageSize=${pageSize}&sort=${sort}`, { headers: { Authorization: `Bearer ${token || ""}` } }),
      fetch(`${base}/api/tours?page=1&pageSize=100`),
      fetch(`${base}/api/users?page=1&pageSize=100`, { headers: { Authorization: `Bearer ${token || ""}` } }),
    ]);
    if (rRes.ok) {
      const data = await rRes.json();
      setReviews(data.items || []);
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

  const tourTitle = (id: number) => tours.find((t) => t.id === id)?.title || `#${id}`;
  const userEmail = (id: number) => users.find((u) => u.id === id)?.email || `#${id}`;

  const filtered = useMemo(() => {
    return reviews
      .filter((r) => (tourId === "all" ? true : r.tourId === tourId))
      .filter((r) =>
        userQuery
          ? userEmail(r.userId).toLowerCase().includes(userQuery.toLowerCase())
          : true
      )
      .filter((r) => (ratingMin != null ? r.rating >= ratingMin : true))
      .filter((r) => (ratingMax != null ? r.rating <= ratingMax : true));
  }, [reviews, tourId, userQuery, ratingMin, ratingMax, users]);

  const deleteReviewReq = async (id: number) => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const res = await fetch(`${base}/api/admin/reviews/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token || ""}` },
    });
    if (res.ok) {
      push({ text: "Đã xóa review", type: "success" });
      await load();
    } else {
      push({ text: "Xóa review thất bại", type: "error" });
    }
  };

  return (
    <div className="py-8 space-y-6">
      <h1 className="text-2xl font-bold">Quản lý Reviews</h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <select
          className="border rounded px-3 py-2 w-full"
          value={tourId === "all" ? "" : tourId}
          onChange={(e) => {
            const v = e.target.value;
            setTourId(v ? Number(v) : "all");
          }}
        >
          <option value="">Tất cả tours</option>
          {tours.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Tìm theo email người dùng..."
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Rating min"
          type="number"
          min={1}
          max={5}
          value={ratingMin ?? ""}
          onChange={(e) => setRatingMin(e.target.value ? Number(e.target.value) : undefined)}
        />
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Rating max"
          type="number"
          min={1}
          max={5}
          value={ratingMax ?? ""}
          onChange={(e) => setRatingMax(e.target.value ? Number(e.target.value) : undefined)}
        />
        <select
          className="border rounded px-3 py-2 w-full"
          value={sort}
          onChange={(e) => setSort(e.target.value as any)}
        >
          <option value="id_desc">ID mới nhất</option>
          <option value="id_asc">ID cũ nhất</option>
          <option value="date_desc">Ngày mới nhất</option>
          <option value="date_asc">Ngày cũ nhất</option>
          <option value="rating_desc">Rating cao nhất</option>
          <option value="rating_asc">Rating thấp nhất</option>
        </select>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <p className="text-sm">Không có review phù hợp</p>
        ) : (
          filtered.map((r) => (
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
              <div className="mt-2">
                <button
                  onClick={() => setConfirmId(r.id)}
                  className="px-3 py-1 rounded border hover:bg-red-100 text-sm"
                >
                  Xóa review
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
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
        <div className="flex items-center gap-2">
          <a
            href={(process.env.NEXT_PUBLIC_API_BASE_URL || "") + "/api/admin/export/reviews"}
            className="px-3 py-1 rounded bg-foreground text-background text-sm hover:opacity-90"
          >
            Xuất CSV
          </a>
          <a
            href={(process.env.NEXT_PUBLIC_API_BASE_URL || "") + "/api/admin/export/reviews?format=xlsx"}
            className="px-3 py-1 rounded border text-sm hover:bg-black/5"
          >
            Xuất Excel
          </a>
        </div>
      </div>

      <ConfirmDialog
        open={confirmId !== null}
        title="Xóa review?"
        description="Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={() => {
          if (confirmId) deleteReviewReq(confirmId);
          setConfirmId(null);
        }}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  );
}