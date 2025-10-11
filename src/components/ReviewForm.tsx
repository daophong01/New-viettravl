"use client";

import { useState } from "react";
import RatingStars from "./RatingStars";
import { useAuth } from "@/src/store/auth";

export default function ReviewForm({ tourId, onCreated }: { tourId: number; onCreated: () => void }) {
  const user = useAuth((s) => s.user);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user?.id ?? 1,
        tourId,
        rating,
        comment,
      }),
    });
    setLoading(false);
    if (res.ok) {
      setComment("");
      setRating(5);
      onCreated();
    }
  };

  return (
    <form onSubmit={submit} className="border rounded p-3 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Viết đánh giá</span>
        <RatingStars value={rating} onChange={setRating} />
      </div>
      <textarea
        className="border rounded w-full px-3 py-2 text-sm"
        placeholder="Cảm nhận của bạn..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
      />
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 rounded bg-foreground text-background disabled:opacity-50"
      >
        {loading ? "Đang gửi..." : "Gửi đánh giá"}
      </button>
    </form>
  );
}