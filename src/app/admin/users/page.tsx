"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/src/store/auth";
import { User } from "@/src/lib/types";
import ConfirmDialog from "@/src/components/ConfirmDialog";
import { useToast } from "@/src/store/toast";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminUsersPage() {
  const token = useAuth((s) => s.token);
  const push = useToast((s) => s.push);
  const [users, setUsers] = useState<User[]>([]);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const load = async () => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const res = await fetch(`${base}/api/users?page=${page}&pageSize=${pageSize}`, {
      headers: { Authorization: `Bearer ${token || ""}` },
    });
    if (res.ok) {
      const data = await res.json();
      setUsers(data.items || []);
      setTotal(data.total || 0);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, page]);

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
      push({ text: "Cập nhật người dùng thành công", type: "success" });
      await load();
    } else {
      push({ text: "Cập nhật thất bại", type: "error" });
    }
  };

  const resetPassword = async (id: number) => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const res = await fetch(`${base}/api/users/${id}/reset-password`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token || ""}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      push({ text: `Mật khẩu mới cho ${data.email}: ${data.newPassword}`, type: "info" });
    } else {
      push({ text: "Reset mật khẩu thất bại", type: "error" });
    }
  };

  const deleteUserReq = async (id: number) => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const res = await fetch(`${base}/api/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token || ""}`,
      },
    });
    if (res.ok) {
      push({ text: "Đã xóa người dùng", type: "success" });
      await load();
    } else {
      push({ text: "Xóa người dùng thất bại", type: "error" });
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
              <button
                onClick={() => resetPassword(u.id)}
                className="px-3 py-1 rounded border hover:bg-black/5 text-sm"
              >
                Reset mật khẩu
              </button>
              <button
                onClick={() => setConfirmId(u.id)}
                className="px-3 py-1 rounded border hover:bg-red-100 text-sm"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
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

      <ConfirmDialog
        open={confirmId !== null}
        title="Xóa người dùng?"
        description="Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={() => {
          if (confirmId) deleteUserReq(confirmId);
          setConfirmId(null);
        }}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  );
}