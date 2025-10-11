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

export default function UserOrdersPage() {
  const token = useAuth((s) => s.token);
  const [items, setItems] = useState<Payment[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);

  useEffect(() => {
    (async () => {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const [ordersRes, toursRes] = await Promise.all([
        fetch(`${base}/api/payments/me`, { headers: { Authorization: `Bearer ${token || ""}` } }),
        fetch(`${base}/api/tours?page=1&pageSize=100`),
      ]);
      if (ordersRes.ok) setItems(await ordersRes.json());
      if (toursRes.ok) {
        const data = await toursRes.json();
        setTours(Array.isArray(data) ? data : data.items || []);
      }
    })();
  }, [token]);

  const tourTitle = (id: number | null) => {
    if (!id) return "-";
    return tours.find((t) => t.id === id)?.title || `#${id}`;
  };

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
              <p className="text-sm">Tour: {tourTitle(p.tourId)}</p>
              <p className="text-sm">Email thanh toán: {p.customerEmail || "-"}</p>
              <p className="text-sm">Payment Intent: {p.paymentIntentId || "-"}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}