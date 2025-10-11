"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/src/store/auth";
import { Tour, User } from "@/src/lib/types";

export default function AdminPage() {
  const user = useAuth((s) => s.user);
  const [tours, setTours] = useState<Tour[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<Partial<Tour>>({
    title: "",
    location: "",
    price: 0,
    duration: "",
    image: "",
    description: "",
  });

  useEffect(() => {
    (async () => {
      const t = await fetch("/api/tours").then((r) => r.json());
      setTours(t);
      // demo users từ mock không có endpoint, hiển thị tạm thời
      setUsers([
        { id: 1, name: "Nguyễn Văn A", email: "a@example.com", role: "user" },
        { id: 2, name: "Admin", email: "admin@example.com", role: "admin" },
      ]);
    })();
  }, []);

  if (!user || user.role !== "admin") {
    return (
      <div className="py-8">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-sm text-black/70 dark:text-white/70">
          Bạn cần đăng nhập với quyền admin để truy cập trang này.
        </p>
      </div>
    );
  }

  const createTour = async () => {
    const res = await fetch("/api/tours", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const created = await res.json();
      setTours((prev) => [...prev, created]);
      setForm({ title: "", location: "", price: 0, duration: "", image: "", description: "" });
    }
  };

  const updateTour = async (id: number, patch: Partial<Tour>) => {
    const res = await fetch(`/api/tours/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (res.ok) {
      const updated = await res.json();
      setTours((prev) => prev.map((t) => (t.id === id ? updated : t)));
    }
  };

  const deleteTour = async (id: number) => {
    const res = await fetch(`/api/tours/${id}`, { method: "DELETE" });
    if (res.ok) {
      setTours((prev) => prev.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="py-8 space-y-8">
      <h1 className="text-2xl font-bold">Admin Panel</h1>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Thêm tour mới</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            placeholder="Tên tour"
            className="border rounded px-3 py-2"
            value={form.title || ""}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
          <input
            placeholder="Địa điểm"
            className="border rounded px-3 py-2"
            value={form.location || ""}
            onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
          />
          <input
            placeholder="Giá"
            type="number"
            className="border rounded px-3 py-2"
            value={form.price || 0}
            onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
          />
          <input
            placeholder="Thời gian"
            className="border rounded px-3 py-2"
            value={form.duration || ""}
            onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
          />
          <input
            placeholder="Image (URL)"
            className="border rounded px-3 py-2"
            value={form.image || ""}
            onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
          />
          <input
            placeholder="Mô tả"
            className="border rounded px-3 py-2"
            value={form.description || ""}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
        </div>
        <button
          onClick={createTour}
          className="px-4 py-2 rounded bg-foreground text-background"
        >
          Tạo tour
        </button>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Quản lý tours</h2>
        <div className="space-y-3">
          {tours.map((t) => (
            <div key={t.id} className="border rounded p-3 space-y-2">
              <div className="flex items-center justify-between">
                <strong>{t.title}</strong>
                <div className="flex gap-2">
                  <button
                    onClick={() => deleteTour(t.id)}
                    className="px-3 py-1 rounded border hover:bg-black/5"
                  >
                    Xóa
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input
                  className="border rounded px-2 py-1"
                  defaultValue={t.title}
                  onBlur={(e) => updateTour(t.id, { title: e.target.value })}
                />
                <input
                  className="border rounded px-2 py-1"
                  defaultValue={t.location}
                  onBlur={(e) => updateTour(t.id, { location: e.target.value })}
                />
                <input
                  className="border rounded px-2 py-1"
                  defaultValue={t.duration}
                  onBlur={(e) => updateTour(t.id, { duration: e.target.value })}
                />
                <input
                  className="border rounded px-2 py-1"
                  defaultValue={t.price}
                  type="number"
                  onBlur={(e) => updateTour(t.id, { price: Number(e.target.value) })}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Người dùng</h2>
        <div className="space-y-2">
          {users.map((u) => (
            <div key={u.id} className="border rounded p-3 flex items-center justify-between">
              <span>{u.name} — {u.email}</span>
              <span className="text-sm px-2 py-1 rounded bg-black/5">{u.role}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}