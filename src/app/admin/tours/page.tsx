"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/src/store/auth";
import { Tour } from "@/src/lib/types";
import ImageUpload from "@/src/components/ImageUpload";


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
    category: "domestic" as any,
    startDate: "" as any,
    seatsLeft: 0 as any,
    active: true as any,
  });

  const [q, setQ] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterCategory, setFilterCategory] = useState<"all" | "domestic" | "international">("all");
  const [filterActive, setFilterActive] = useState<"all" | "active" | "inactive">("all");

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
      body: JSON.stringify({
        ...form,
        startDate: form.startDate ? new Date(form.startDate as any) : null,
        seatsLeft: Number(form.seatsLeft || 0),
      }),
    });
    if (res.ok) {
      const created = await res.json();
      setTours((prev) => [...prev, created]);
      setForm({ title: "", location: "", price: 0, duration: "", image: "", description: "", category: "domestic" as any, startDate: "" as any, seatsLeft: 0 as any, active: true as any });
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

  const filtered = useMemo(() => {
    return tours
      .filter((t) => (q ? (t.title || "").toLowerCase().includes(q.toLowerCase()) : true))
      .filter((t) => (filterLocation ? (t.location || "").toLowerCase().includes(filterLocation.toLowerCase()) : true))
      .filter((t) => (filterCategory === "all" ? true : (t as any).category === filterCategory))
      .filter((t) => (filterActive === "all" ? true : ((t as any).active ? "active" : "inactive") === filterActive));
  }, [tours, q, filterLocation, filterCategory, filterActive]);

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
            placeholder="Thời gian (vd: 3 ngày 2 đêm)"
            className="border rounded px-3 py-2"
            value={form.duration || ""}
            onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
          />
          <input
            type="date"
            placeholder="Ngày khởi hành"
            className="border rounded px-3 py-2"
            value={(form.startDate as any) || ""}
            onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value as any }))}
          />
          <input
            type="number"
            placeholder="Số chỗ còn lại"
            className="border rounded px-3 py-2"
            value={(form.seatsLeft as any) || 0}
            onChange={(e) => setForm((f) => ({ ...f, seatsLeft: Number(e.target.value) as any }))}
          />
          <select
            className="border rounded px-3 py-2"
            value={(form.category as any) || "domestic"}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as any }))}
          >
            <option value="domestic">Tour trong nước</option>
            <option value="international">Tour quốc tế</option>
          </select>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!form.active}
              onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked as any }))}
            />
            Hoạt động
          </label>
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <input className="border rounded px-3 py-2" placeholder="Tìm kiếm tên..." value={q} onChange={(e) => setQ(e.target.value)} />
          <input className="border rounded px-3 py-2" placeholder="Lọc theo địa điểm..." value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)} />
          <select className="border rounded px-3 py-2" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value as any)}>
            <option value="all">Tất cả danh mục</option>
            <option value="domestic">Trong nước</option>
            <option value="international">Quốc tế</option>
          </select>
          <select className="border rounded px-3 py-2" value={filterActive} onChange={(e) => setFilterActive(e.target.value as any)}>
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>
        </div>

        <div className="space-y-3">
          {filtered.map((t) => (
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
                <input
                  type="date"
                  className="border rounded px-2 py-1"
                  defaultValue={(t as any).startDate ? new Date((t as any).startDate as any).toISOString().slice(0, 10) : ""}
                  onBlur={(e) => updateTour(t.id, { startDate: e.target.value as any } as any)}
                />
                <input
                  type="number"
                  className="border rounded px-2 py-1"
                  defaultValue={(t as any).seatsLeft || 0}
                  onBlur={(e) => updateTour(t.id, { seatsLeft: Number(e.target.value) as any })}
                />
                <select
                  className="border rounded px-2 py-1"
                  defaultValue={(t as any).category || "domestic"}
                  onBlur={(e) => updateTour(t.id, { category: e.target.value as any })}
                >
                  <option value="domestic">Trong nước</option>
                  <option value="international">Quốc tế</option>
                </select>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    defaultChecked={!!(t as any).active}
                    onChange={(e) => updateTour(t.id, { active: e.target.checked as any })}
                  />
                  Hoạt động
                </label>
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
              {/* Quick payment test */}
              {(() => {
                const PaymentButton = require("@/src/components/PaymentButton").default;
                return <PaymentButton tourId={t.id as any} title={t.title} amount={t.price as any} />;
              })()}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}