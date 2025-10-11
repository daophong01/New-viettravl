"use client";

import { useEffect, useMemo, useState } from "react";
import TourCard from "@/src/components/TourCard";
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

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/tours");
      if (res.ok) {
        setTours(await res.json());
      }
    })();
  }, []);

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

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [query, maxPrice, location, sort]);

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
        {paged.map((t) => (
          <TourCard key={t.id} tour={t} />
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
          {page} / {totalPages}
        </span>
        <button
          className="px-3 py-1 rounded border hover:bg-black/5"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Trang sau
        </button>
      </div>
    </div>
  );
}