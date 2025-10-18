"use client";
import type { Metadata } from "next";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/src/store/auth";
import TourCard from "@/src/components/TourCard";
import SkeletonCard from "@/src/components/SkeletonCard";
import { Tour } from "@/src/lib/types";
import SearchBar from "@/src/components/SearchBar";
import FilterBox from "@/src/components/FilterBox";

export const metadata: Metadata = {
  title: "Tours | TravelGo",
  description: "Danh sách tour du lịch hấp dẫn trên TravelGo.",
  alternates: { canonical: (process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000") + "/tours" },
  openGraph: {
    title: "Tours | TravelGo",
    description: "Danh sách tour du lịch hấp dẫn trên TravelGo.",
    url: (process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000") + "/tours",
    images: [{ url: "/next.svg", alt: "TravelGo" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tours | TravelGo",
    description: "Danh sách tour du lịch hấp dẫn trên TravelGo.",
    images: ["/next.svg"],
  },
};

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [query, setQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState<
    "price_asc" | "price_desc" | "rating_desc" | "favorites_desc" | "bookings_desc" | "revenue_desc"
  >("rating_desc");
  const [onlyFavs, setOnlyFavs] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const token = useAuth((s) => s.token);

  const fetchPage = async (p: number) => {
    setLoading(true);
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const res = await fetch(`${base}/api/tours?page=${p}&pageSize=${pageSize}&sort=${sort}`);
    if (res.ok) {
      const data = await res.json();
      const items = Array.isArray(data) ? data : data.items || [];
      setTours(items);
      setTotal(Array.isArray(data) ? items.length : data.total || items.length);
    }
    // fetch favorites IDs (ignore errors)
    try {
      if (token) {
        const favRes = await fetch(`${base}/api/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (favRes.ok) {
          const favs = await favRes.json();
          setFavoriteIds(favs.map((f: any) => f.tourId));
        } else {
          setFavoriteIds([]);
        }
      } else {
        setFavoriteIds([]);
      }
    } catch {
      setFavoriteIds([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPage(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sort]);

  const filtered = useMemo(() => {
    let data = tours
      .filter((t) =>
        query ? t.title.toLowerCase().includes(query.toLowerCase()) : true
      )
      .filter((t) =>
        location ? t.location.toLowerCase().includes(location.toLowerCase()) : true
      )
      .filter((t) => (maxPrice ? t.price <= maxPrice : true))
      .filter((t) => (onlyFavs ? favoriteIds.includes(t.id as any) : true));
    // client-side sort already matched with server sort, keep for UX
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
  }, [tours, query, maxPrice, location, sort, onlyFavs, favoriteIds]);

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
      <div className="flex items-center gap-2">
        <label className="text-sm flex items-center gap-1">
          <input type="checkbox" checked={onlyFavs} onChange={(e) => setOnlyFavs(e.target.checked)} />
          Chỉ hiển thị tour yêu thích
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : filtered.map((t) => (
              <TourCard key={t.id} tour={t} isFavorited={favoriteIds.includes(t.id as any)} />
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
          disabled={page >= totalPages}
        >
          Trang sau
        </button>
      </div>
    </div>
  );
}