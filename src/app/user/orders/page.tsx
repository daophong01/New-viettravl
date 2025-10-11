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
  customerEmail?: string | null;
  paymentIntentId?: string | null;
};

export default function UserOrdersPage() {
  const token = useAuth((s) => s.token);
  const [items, setItems] = useState<Payment[]>([]);

  useEffect(() => {
    (async () => {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const res = await fetch(`${base}/api/payments/me`, {
        headers: { Authorization: `Bearer ${token || ""}` },
      });
      if (res.ok) setItems(await res.json());
    })();
  }, [token]);

  return (
    <div className="py-8 space-y-6">
      <h1 className="text-2xl font-bold">Đơn hàng của bạn</h1>
      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-sm">Bạn chưa có đơn hàng nào</p>
        ) : (
          items.map((p) => (
            <div key={p.id} className="border rounded p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Session: {p.sessionId}</span>
                <span className="text-xs">{p.status}</span>
              </div>
              <p className="text-sm">
                Số tiền: {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p.amount)}
              </p>
              <p className="text-sm">Email thanh toán: {p.customerEmail || "-"}</p>
              <p className="text-sm">Payment Intent: {p.paymentIntentId || "-"}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}