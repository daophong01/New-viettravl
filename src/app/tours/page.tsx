"use client";

import { useEffect, useMemo, useState } from "react";
import TourCard from "@/src/components/TourCard";
import SkeletonCard from "@/src/components/SkeletonCard";
import { Tour } from "@/src/lib/types";
import SearchBar from "@/src/components/SearchBar";
import FilterBox from "@/src/components/FilterBox";

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [query, setQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState<"price_asc" | "price_desc" | "rating_desc">("rating_desc");
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const fetchPage = async (p: number) => {
    setLoading(true);
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const res = await fetch(`${base}/api/tours?page=${p}&pageSize=${pageSize}`);
    if (res.ok) {
      const data = await res.json();
      const items = Array.isArray(data) ? data : data.items || [];
      setTours(items);
      setTotal(Array.isArray(data) ? items.length : data.total || items.length);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPage(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const filtered = useMemo(() => {
    let data = tours
      .filter((t) =>
        query ? t.title.toLowerCase().includes(query.toLowerCase()) : true
      )
      .filter((t) =>
        location ? t.location.toLowerCase().includes(location.toLowerCase()) : true
      )
      .filter((t) => (maxPrice ? t.price <= maxPrice : true));
    switch (sort) {
      case "price_asc":
        data = data.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        data = data.sort((a, b) => b.price - a.price);
        break;
      case "rating_desc":
        data = data.sort((a, b) => b.rating - a.rating);
        break;
    }
    return data;
  }, [tours, query, maxPrice, location, sort]);

  useEffect(() => {
    setPage(1);
  }, [query, maxPrice, location, sort]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="py-8 space-y-6">
      <h1 className="text-2xl font-bold">Danh sách Tours</h1>

      <SearchBar query={query} onQueryChange={setQuery} />
      <FilterBox
        location={location}
        onLocationChange={setLocation}
        maxPrice={maxPrice}
        onMaxPriceChange={setMaxPrice}
        sort={sort}
        onSortChange={setSort}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : filtered.map((t) => <TourCard key={t.id} tour={t} />)}
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
          {page} / {totalPages}
        </span>
        <button
          className="px-3 py-1 rounded border hover:bg-black/5"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
        >
          Trang sau
        </button>
      </div>
    </div>
  );
}