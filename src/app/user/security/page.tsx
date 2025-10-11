"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/src/store/auth";

type LoginEvent = {
  id: number;
  userId: number;
  ip: string | null;
  userAgent: string | null;
  createdAt?: string;
};

export default function UserSecurityPage() {
  const token = useAuth((s) => s.token);
  const [items, setItems] = useState<LoginEvent[]>([]);

  const load = async () => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const res = await fetch(`${base}/api/auth/logins`, {
      headers: { Authorization: `Bearer ${token || ""}` },
    });
    if (res.ok) setItems(await res.json());
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="py-8 space-y-6">
      <h1 className="text-2xl font-bold">Bảo mật tài khoản</h1>
      <p className="text-sm">Lịch sử đăng nhập gần đây (thiết bị/IP):</p>

      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-sm">Chưa có dữ liệu</p>
        ) : (
          items.map((e) => (
            <div key={e.id} className="border rounded p-3 flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm">IP: {e.ip || "-"}</div>
                <div className="text-xs text-black/60 dark:text-white/60">UA: {e.userAgent || "-"}</div>
              </div>
              <div className="text-xs text-black/60 dark:text-white/60">
                {e.createdAt ? new Date(e.createdAt).toLocaleString("vi-VN") : ""}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}