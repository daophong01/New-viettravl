"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/src/store/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

type SupportMessage = {
  id: number;
  name: string | null;
  email: string | null;
  userId: number | null;
  message: string;
  status: "new" | "resolved";
  createdAt?: string;
};

export default function AdminSupportPage() {
  const token = useAuth((s) => s.token);
  const [items, setItems] = useState<SupportMessage[]>([]);
  const [search, setSearch] = useState("");

  const load = async () => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const res = await fetch(`${base}/api/support/admin/messages`, {
      headers: { Authorization: `Bearer ${token || ""}` },
    });
    if (res.ok) setItems(await res.json());
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const updateStatus = async (id: number, status: "new" | "resolved") => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const res = await fetch(`${base}/api/support/admin/messages/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      },
      body: JSON.stringify({ status }),
    });
    if (res.ok) await load();
  };

  const filtered = items.filter(
    (m) =>
      !search ||
      (m.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (m.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (m.message || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="py-8 space-y-6">
      <h1 className="text-2xl font-bold">Hỗ trợ khách hàng</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Tìm theo tên, email hoặc nội dung..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <p className="text-sm">Chưa có tin nhắn</p>
        ) : (
          filtered.map((m) => (
            <div key={m.id} className="border rounded p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm">{m.name || "(ẩn danh)"} — {m.email || "-"}</div>
                  <div className="text-xs text-black/60 dark:text-white/60">
                    {m.createdAt ? new Date(m.createdAt).toLocaleString("vi-VN") : ""}
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-black/5">{m.status}</span>
              </div>
              <p className="text-sm mt-2">{m.message}</p>
              <div className="mt-2 flex gap-2">
                {m.status === "resolved" ? (
                  <button
                    onClick={() => updateStatus(m.id, "new")}
                    className="px-3 py-1 rounded border hover:bg-black/5 text-sm"
                  >
                    Đánh dấu chưa xử lý
                  </button>
                ) : (
                  <button
                    onClick={() => updateStatus(m.id, "resolved")}
                    className="px-3 py-1 rounded border hover:bg-black/5 text-sm"
                  >
                    Đánh dấu đã xử lý
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}