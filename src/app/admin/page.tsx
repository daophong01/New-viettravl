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
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const tRes = await fetch(`${base}/api/tours`);
      if (tRes.ok) setTours(await tRes.json());

      const usersRes = await fetch(`${base}/api/users`, {
        headers: {
          ...(user?.id ? { Authorization: `Bearer ${useAuth.getState().token}` } : {}),
        } as any,
      });
      if (usersRes.ok) setUsers(await usersRes.json());
    })();
  }, [user]);

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
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const res = await fetch(`${base}/api/tours`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(user ? { Authorization: `Bearer ${useAuth.getState().token}` } : {}),
      },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const created = await res.json();
      setTours((prev) => [...prev, created]);
      setForm({ title: "", location: "", price: 0, duration: "", image: "", description: "" });
    }
  };

  const updateTour = async (id: number, patch: Partial<Tour>) => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const res = await fetch(`${base}/api/tours/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(user ? { Authorization: `Bearer ${useAuth.getState().token}` } : {}),
      },
      body: JSON.stringify(patch),
    });
    if (res.ok) {
      const updated = await res.json();
      setTours((prev) => prev.map((t) => (t.id === id ? updated : t)));
    }
  };

  const deleteTour = async (id: number) => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const res = await fetch(`${base}/api/tours/${id}`, {
      method: "DELETE",
      headers: {
        ...(user ? { Authorization: `Bearer ${useAuth.getState().token}` } : {}),
      },
    });
    if (res.ok) {
      setTours((prev) => prev.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="py-8 space-y-8">
      <h1 className="text-2xl font-bold">Admin Panel</h1>

      {/* Dashboard stats */}
      {(() => {
        const DashboardStats = () => {
          const [stats, setStats] = useState<{ usersCount: number; toursCount: number; bookingsCount: number; reviewsCount: number } | null>(null);
          useEffect(() => {
            (async () => {
              const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
              const res = await fetch(`${base}/api/admin/dashboard`, {
                headers: { Authorization: `Bearer ${useAuth.getState().token}` },
              });
              if (res.ok) setStats(await res.json());
            })();
          }, []);
          if (!stats) return null;
          return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="border rounded p-3">
                <div className="text-xs text-black/60">Users</div>
                <div className="text-xl font-semibold">{stats.usersCount}</div>
              </div>
              <div className="border rounded p-3">
                <div className="text-xs text-black/60">Tours</div>
                <div className="text-xl font-semibold">{stats.toursCount}</div>
              </div>
              <div className="border rounded p-3">
                <div className="text-xs text-black/60">Bookings</div>
                <div className="text-xl font-semibold">{stats.bookingsCount}</div>
              </div>
              <div className="border rounded p-3">
                <div className="text-xs text-black/60">Reviews</div>
                <div className="text-xl font-semibold">{stats.reviewsCount}</div>
              </div>
            </div>
          );
        };
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error inline client component inside page
        return <DashboardStats />;
      })()}

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
          <div className="space-y-2">
            <input
              placeholder="Image (URL)"
              className="border rounded px-3 py-2 w-full"
              value={form.image || ""}
              onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
            />
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-expect-error dynamic import in client component */}
            {(() => {
              const ImageUpload = require("@/src/components/ImageUpload").default;
              return (
                <ImageUpload
                  onUploaded={(url: string) => setForm((f) => ({ ...f, image: url }))}
                />
              );
            })()}
          </div>
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