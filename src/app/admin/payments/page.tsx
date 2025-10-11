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

  useEffect(() => {
    (async () => {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const res = await fetch(`${base}/api/admin/payments`, {
        headers: { Authorization: `Bearer ${token || ""}` },
      });
      if (res.ok) setItems(await res.json());
    })();
  }, [token]);

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
    </div>
  );
}