"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/src/store/auth";
import { Tour } from "@/src/lib/types";

type Payment = {
  id: number;
  sessionId: string;
  amount: number;
  status: "succeeded" | "failed" | "pending";
  userId: number | null;
  tourId: number | null;
  customerEmail?: string | null;
  paymentIntentId?: string | null;
};



export default function AdminPaymentsPage() {
  const token = useAuth((s) => s.token);
  const [items, setItems] = useState<Payment[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [tours, setTours] = useState<Tour[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "succeeded" | "failed" | "pending">("all");
  const [sort, setSort] = useState<"id_desc" | "id_asc" | "date_desc" | "date_asc" | "amount_desc" | "amount_asc">("id_desc");
  const [tourFilter, setTourFilter] = useState<number | "all">("all");

  const load = async () => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const qs = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      sort,
      status,
      ...(tourFilter === "all" ? {} : { tourId: String(tourFilter) }),
    }).toString();
    const [pRes, tRes] = await Promise.all([
      fetch(`${base}/api/admin/payments?${qs}`, {
        headers: { Authorization: `Bearer ${token || ""}` },
      }),
      fetch(`${base}/api/tours?page=1&pageSize=100`),
    ]);
    if (pRes.ok) {
      const data = await pRes.json();
      setItems(data.items || []);
      setTotal(data.total || 0);
    }
    if (tRes.ok) {
      const data = await tRes.json();
      setTours(Array.isArray(data) ? data : data.items || []);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, page, status, sort, tourFilter]);

  const tourTitle = (id: number | null) => {
    if (!id) return "-";
    return tours.find((t) => t.id === id)?.title || `#${id}`;
  };

  const filtered = items.filter(
    (p) =>
      !search ||
      (p.customerEmail || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.sessionId || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="py-8 space-y-6">
      <h1 className="text-2xl font-bold">Quản lý Payments</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Tìm theo email hoặc session id..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border rounded px-3 py-2 w-full"
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="succeeded">Thành công</option>
          <option value="failed">Thất bại</option>
          <option value="pending">Đang chờ</option>
        </select>
        <select
          className="border rounded px-3 py-2 w-full"
          value={sort}
          onChange={(e) => setSort(e.target.value as any)}
        >
          <option value="id_desc">ID mới nhất</option>
          <option value="id_asc">ID cũ nhất</option>
          <option value="date_desc">Ngày mới nhất</option>
          <option value="date_asc">Ngày cũ nhất</option>
          <option value="amount_desc">Số tiền cao nhất</option>
          <option value="amount_asc">Số tiền thấp nhất</option>
        </select>
        <select
          className="border rounded px-3 py-2 w-full"
          value={tourFilter === "all" ? "" : tourFilter}
          onChange={(e) => {
            const v = e.target.value;
            setTourFilter(v ? Number(v) : "all");
          }}
        >
          <option value="">Tất cả tours</option>
          {tours.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <p className="text-sm">Chưa có payments</p>
        ) : (
          filtered.map((p) => (
            <div key={p.id} className="border rounded p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Session: {p.sessionId}</span>
                <span className="text-xs">{p.status}</span>
              </div>
              <p className="text-sm">
                Số tiền: {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p.amount)}
              </p>
              <p className="text-sm">Tour: {tourTitle(p.tourId)}</p>
              <p className="text-sm">Email thanh toán: {p.customerEmail || "-"}</p>
              <p className="text-sm">Payment Intent: {p.paymentIntentId || "-"}</p>
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
            href={(process.env.NEXT_PUBLIC_API_BASE_URL || "") + "/api/admin/export/payments"}
            className="px-3 py-1 rounded bg-foreground text-background text-sm hover:opacity-90"
          >
            Xuất CSV
          </a>
          <a
            href={(process.env.NEXT_PUBLIC_API_BASE_URL || "") + "/api/admin/export/payments?format=xlsx"}
            className="px-3 py-1 rounded border text-sm hover:bg-black/5"
          >
            Xuất Excel
          </a>
        </div>
      </div>
    </div>
  );
}