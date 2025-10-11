"use client";

import { useEffect, useMemo, useState } from "react";
import TourCard from "@/src/components/TourCard";
import { Tour } from "@/src/lib/types";

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [query, setQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [location, setLocation] = useState("");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/tours");
      if (res.ok) {
        setTours(await res.json());
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    return tours
      .filter((t) =>
        query ? t.title.toLowerCase().includes(query.toLowerCase()) : true
      )
      .filter((t) =>
        location ? t.location.toLowerCase().includes(location.toLowerCase()) : true
      )
      .filter((t) => (maxPrice ? t.price <= maxPrice : true));
  }, [tours, query, maxPrice, location]);

  return (
    <div className="py-8 space-y-6">
      <h1 className="text-2xl font-bold">Danh sách Tours</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          placeholder="Tìm kiếm theo tên tour..."
          className="border rounded px-3 py-2 w-full"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <input
          placeholder="Địa điểm..."
          className="border rounded px-3 py-2 w-full"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          placeholder="Giá tối đa (VND)"
          className="border rounded px-3 py-2 w-full"
          type="number"
          value={maxPrice ?? ""}
          onChange={(e) =>
            setMaxPrice(e.target.value ? Number(e.target.value) : undefined)
          }
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((t) => (
          <TourCard key={t.id} tour={t} />
        ))}
      </div>
    </div>
  );
}