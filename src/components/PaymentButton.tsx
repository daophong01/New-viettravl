"use client";

import { useState } from "react";
import { useAuth } from "@/src/store/auth";

export default function PaymentButton({
  tourId,
  title,
  amount,
}: {
  tourId: number;
  title: string;
  amount: number; // VND in smallest currency unit (VND uses 1 unit)
}) {
  const token = useAuth((s) => s.token);
  const [loading, setLoading] = useState(false);

  const pay = async () => {
    setLoading(true);
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const res = await fetch(`${base}/api/payments/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ tourId, title, amount }),
    });
    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    }
  };

  return (
    <button
      onClick={pay}
      disabled={loading}
      className="px-4 py-2 rounded border hover:bg-black/5"
    >
      {loading ? "Đang chuyển..." : "Thanh toán Stripe (Sandbox)"}
    </button>
  );
}