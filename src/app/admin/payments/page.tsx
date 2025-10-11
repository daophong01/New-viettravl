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

  const load = async () => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const [pRes, tRes] = await Promise.all([
      fetch(`${base}/api/admin/payments?page=${page}&pageSize=${pageSize}`, {
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
  }, [token, page]);

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

      <div className="flex gap-2">
        <input
          className="border rounded px-3 py-2"
          placeholder="Tìm theo email hoặc session id..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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