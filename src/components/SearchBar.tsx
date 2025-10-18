"use client";

export default function SearchBar({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (v: string) => void;
}) {
  return (
    <input
      placeholder="Tìm kiếm theo tên tour..."
      className="border rounded px-3 py-2 w-full"
      value={query}
      onChange={(e) => onQueryChange(e.target.value)}
    />
  );
}