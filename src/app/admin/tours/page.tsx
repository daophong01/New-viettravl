"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/src/store/auth";
import { Tour } from "@/src/lib/types";
import ImageUpload from "@/src/components/ImageUpload";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminToursPage() {
  const token = useAuth((s) => s.token);
  const [tours, setTours] = useState<Tour[]>([]);
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
      const res = await fetch(`${base}/api/tours?page=1&pageSize=100&sort=id_asc`);
      if (res.ok) {
        const data = await res.json();
        setTours(Array.isArray(data) ? data : data.items || []);
      }
    })();
  }, []);

  const createTour = async () => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const res = await fetch(`${base}/api/tours`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
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
        Authorization: `Bearer ${token || ""}`,
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
        Authorization: `Bearer ${token || ""}`,
      },
    });
    if (res.ok) {
      setTours((prev) => prev.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="py-8 space-y-8">
      <h1 className="text-2xl font-bold">Quản lý Tours</h1>

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
            <ImageUpload
              publicId={form.title ? `tour_${form.title.replace(/\\s+/g, "_").toLowerCase()}_${Date.now()}` : undefined}
              folder="travelgo/tours"
              onUploaded={(url) => setForm((f) => ({ ...f, image: url }))}
            />
          </div>
          <input
            placeholder="Mô tả"
            className="border rounded px-3 py-2"
            value={form.description || ""}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
        </div>
        <button onClick={createTour} className="px-4 py-2 rounded bg-foreground text-background">
          Tạo tour
        </button>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Danh sách tours</h2>
        <div className="space-y-3">
          {tours.map((t) => (
            <div key={t.id} className="border rounded p-3 space-y-2">
              <div className="flex items-center justify-between">
                <strong>{t.title}</strong>
                <div className="flex gap-2">
                  <button onClick={() => deleteTour(t.id)} className="px-3 py-1 rounded border hover:bg-black/5">
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
                <div className="flex items-center gap-2">
                  <input
                    className="border rounded px-2 py-1 flex-1"
                    defaultValue={t.image || ""}
                    onBlur={(e) => updateTour(t.id, { image: e.target.value })}
                    placeholder="Image URL"
                  />
                  <ImageUpload
                    folder="travelgo/tours"
                    publicId={`tour_${t.id}`}
                    onUploaded={(url) => updateTour(t.id, { image: url })}
                    onUploadedPublicId={(pid) => updateTour(t.id, { imagePublicId: pid })}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}