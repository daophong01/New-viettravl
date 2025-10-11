"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/src/store/auth";
import { User } from "@/src/lib/types";

export default function AdminUsersPage() {
  const token = useAuth((s) => s.token);
  const [users, setUsers] = useState<User[]>([]);

  const load = async () => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const res = await fetch(`${base}/api/users`, {
      headers: { Authorization: `Bearer ${token || ""}` },
    });
    if (res.ok) setUsers(await res.json());
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const updateUser = async (id: number, patch: Partial<User>) => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const res = await fetch(`${base}/api/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      },
      body: JSON.stringify(patch),
    });
    if (res.ok) {
      await load();
    }
  };

  return (
    <div className="py-8 space-y-6">
      <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
      <div className="space-y-2">
        {users.map((u) => (
          <div key={u.id} className="border rounded p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span>{u.name} — {u.email}</span>
              <span className="text-sm px-2 py-1 rounded bg-black/5">{u.role}</span>
              <span className="text-sm px-2 py-1 rounded bg-black/5">{u.status || "active"}</span>
            </div>
            <div className="flex items-center gap-2">
              {u.role === "user" ? (
                <button
                  onClick={() => updateUser(u.id, { role: "admin" })}
                  className="px-3 py-1 rounded border hover:bg-black/5 text-sm"
                >
                  Nâng quyền Admin
                </button>
              ) : (
                <button
                  onClick={() => updateUser(u.id, { role: "user" })}
                  className="px-3 py-1 rounded border hover:bg-black/5 text-sm"
                >
                  Giảm về User
                </button>
              )}
              {u.status === "blocked" ? (
                <button
                  onClick={() => updateUser(u.id, { status: "active" })}
                  className="px-3 py-1 rounded border hover:bg-black/5 text-sm"
                >
                  Mở khóa
                </button>
              ) : (
                <button
                  onClick={() => updateUser(u.id, { status: "blocked" })}
                  className="px-3 py-1 rounded border hover:bg-black/5 text-sm"
                >
                  Khóa
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}