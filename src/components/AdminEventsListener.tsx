"use client";

import { useEffect } from "react";
import { useAuth } from "@/src/store/auth";
import { useToast } from "@/src/store/toast";

export default function AdminEventsListener() {
  const user = useAuth((s) => s.user);
  const push = useToast((s) => s.push);

  useEffect(() => {
    if (!user || !["admin", "superadmin", "tourmanager", "financeadmin", "supportstaff", "contenteditor"].includes(user.role as any)) {
      return;
    }
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const url = `${base}/api/admin/events/stream`;
    const es = new EventSource(url);

    es.addEventListener("message", (e) => {
      try {
        const data = JSON.parse((e as MessageEvent).data || "{}");
        if (data?.type === "booking_created") {
          push({ text: `Đơn đặt mới #${data.id} (tour #${data.tourId})`, type: "info" });
        } else if (data?.type === "payment_succeeded") {
          push({ text: `Thanh toán thành công • ${Number(data.amount || 0).toLocaleString("vi-VN")} VND`, type: "success" });
        }
      } catch {}
    });

    es.addEventListener("ping", () => {});

    return () => {
      es.close();
    };
  }, [user, push]);

  return null;
}