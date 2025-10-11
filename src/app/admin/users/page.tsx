"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/src/store/auth";
import { User } from "@/src/lib/types";

export default function AdminUsersPage() {
  const token = useAuth((s) => s.token);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    (async () => {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const res = await fetch(`${base}/api/users`, {
        headers: { Authorization: `Bearer ${token || ""}` },
      });
      if (res.ok) setUsers(await res.json());
    })();
  }, [token]);

  return (
    <div className="py-8 space-y-6">
      <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
      <div className="space-y-2">
        {users.map((u) => (
          <div key={u.id} className="border rounded p-3 flex items-center justify-between">
            <span>{u.name} — {u.email}</span>
            <span className="text-sm px-2 py-1 rounded bg-black/5">{u.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}