"use client";

export default function FilterBox({
  location,
  onLocationChange,
  maxPrice,
  onMaxPriceChange,
  sort,
  onSortChange,
}: {
  location: string;
  onLocationChange: (v: string) => void;
  maxPrice?: number;
  onMaxPriceChange: (v?: number) => void;
  sort: "price_asc" | "price_desc" | "rating_desc" | "favorites_desc";
  onSortChange: (v: "price_asc" | "price_desc" | "rating_desc" | "favorites_desc") => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <input
        placeholder="Địa điểm..."
        className="border rounded px-3 py-2 w-full"
        value={location}
        onChange={(e) => onLocationChange(e.target.value)}
      />
      <input
        placeholder="Giá tối đa (VND)"
        className="border rounded px-3 py-2 w-full"
        type="number"
        value={maxPrice ?? ""}
        onChange={(e) => onMaxPriceChange(e.target.value ? Number(e.target.value) : undefined)}
      />
      <select
        className="border rounded px-3 py-2 w-full"
        value={sort}
        onChange={(e) =>
          onSortChange(
            e.target.value as
              | "price_asc"
              | "price_desc"
              | "rating_desc"
              | "favorites_desc"
              | "bookings_desc"
              | "revenue_desc"
          )
        }
      >
        <option value="price_asc">Giá tăng dần</option>
        <option value="price_desc">Giá giảm dần</option>
        <option value="rating_desc">Đánh giá cao nhất</option>
        <option value="favorites_desc">Được yêu thích nhiều nhất</option>
        <option value="bookings_desc">Được đặt nhiều nhất</option>
        <option value="revenue_desc">Doanh thu cao nhất</option>
      </select>
    </div>
  );
}