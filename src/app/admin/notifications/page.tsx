"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/src/store/auth";

type Notification = {
  id: number;
  type: "booking_created" | "payment_succeeded";
  payload: string;
  read: boolean;
  createdAt?: string;
};

export default function AdminNotificationsPage() {
  const token = useAuth((s) => s.token);
  const [items, setItems] = useState<Notification[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState<"all" | "booking" | "payment">("all");
  const [detail, setDetail] = useState<Notification | null>(null);

  const load = async () => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const res = await fetch(`${base}/api/admin/notifications?page=${page}&pageSize=${pageSize}`, {
      headers: { Authorization: `Bearer ${token || ""}` },
    });
    if (res.ok) {
      const data = await res.json();
      setItems(data.items || []);
      setTotal(data.total || 0);
    }
  };

  const markRead = async (id: number) => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const res = await fetch(`${base}/api/admin/notifications/mark-read`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token || ""}` },
      body: JSON.stringify({ id }),
    });
    if (res.ok) load();
  };

  const clearAll = async () => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const res = await fetch(`${base}/api/admin/notifications/clear`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token || ""}` },
    });
    if (res.ok) load();
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, page]);

  const filtered = items.filter((n) =>
    filter === "all" ? true : filter === "booking" ? n.type === "booking_created" : n.type === "payment_succeeded"
  );

  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  return (
    <div className="py-8 space-y-6">
      <h1 className="text-2xl font-bold">Notifications</h1>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-sm">Tổng: {total}</div>
          <select className="border rounded px-3 py-2 text-sm" value={filter} onChange={(e) => setFilter(e.target.value as any)}>
            <option value="all">Tất cả</option>
            <option value="booking">Booking</option>
            <option value="payment">Payment</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`${base}/api/admin/notifications/export`}
            className="px-3 py-1 rounded border text-sm hover:bg-black/5"
            target="_blank"
            rel="noreferrer"
          >
            Export CSV
          </a>
          <button onClick={clearAll} className="px-3 py-1 rounded border hover:bg-black/5 text-sm">Xóa tất cả</button>
        </div>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <p className="text-sm">Không có thông báo.</p>
        ) : (
          filtered.map((n) => {
            const data = (() => { try { return JSON.parse(n.payload || "{}"); } catch { return {}; } })();
            const text = n.type === "booking_created"
              ? `Đơn đặt mới #${data.id} • Tour #${data.tourId}`
              : `Thanh toán thành công • ${Number(data.amount || 0).toLocaleString("vi-VN")} VND`;
            return (
              <div key={n.id} className={`border rounded p-3 flex items-center justify-between ${n.read ? "opacity-60" : ""}`}>
                <div>
                  <button className="text-left" onClick={() => setDetail(n)}>
                    <div className="text-sm">{text}</div>
                    <div className="text-xs text-black/60 dark:text-white/60">{n.createdAt ? new Date(n.createdAt).toLocaleString("vi-VN") : ""}</div>
                  </button>
                </div>
                {!n.read && (
                  <button onClick={() => markRead(n.id)} className="px-3 py-1 rounded border hover:bg-black/5 text-sm">
                    Đánh dấu đã đọc
                  </button>
                )}
              </div>
            );
          })
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

      {detail && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setDetail(null)}>
          <div className="bg-background rounded p-4 w-[90%] max-w-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-2">Chi tiết thông báo</h2>
            <div className="text-sm space-y-1">
              <div>Loại: {detail.type}</div>
              <div>Thời gian: {detail.createdAt ? new Date(detail.createdAt).toLocaleString("vi-VN") : "-"}</div>
              <pre className="text-xs bg-black/5 rounded p-2 overflow-auto">{detail.payload}</pre>
            </div>
            <div className="mt-3 flex items-center justify-end gap-2">
              {!detail.read && (
                <button onClick={() => { markRead(detail.id); }} className="px-3 py-1 rounded border hover:bg-black/5 text-sm">Đánh dấu đã đọc</button>
              )}
              <button onClick={() => setDetail(null)} className="px-3 py-1 rounded bg-foreground text-background text-sm">Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}