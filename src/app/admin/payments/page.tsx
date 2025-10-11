"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/src/store/auth";

type Payment = {
  id: number;
  sessionId: string;
  amount: number;
  status: "succeeded" | "failed" | "pending";
  userId: number | null;
  tourId: number | null;
};

export default function AdminPaymentsPage() {
  const token = useAuth((s) => s.token);
  const [items, setItems] = useState<Payment[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const load = async () => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const res = await fetch(`${base}/api/admin/payments?page=${page}&pageSize=${pageSize}`, {
      headers: { Authorization: `Bearer ${token || ""}` },
    });
    if (res.ok) {
      const data = await res.json();
      setItems(data.items || []);
      setTotal(data.total || 0);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, page]);

  return (
    <div className="py-8 space-y-6">
      <h1 className="text-2xl font-bold">Quản lý Payments</h1>
      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-sm">Chưa có payments</p>
        ) : (
          items.map((p) => (
            <div key={p.id} className="border rounded p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Session: {p.sessionId}</span>
                <span className="text-xs">{p.status}</span>
              </div>
              <p className="text-sm">
                Amount: {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p.amount)}
              </p>
              <p className="text-sm">User: {p.userId || "-"}</p>
              <p className="text-sm">Tour: {p.tourId || "-"}</p>
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