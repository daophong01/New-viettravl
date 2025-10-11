"use client";

import { useEffect, useState } from "react";
import { Review } from "@/src/lib/types";
import ReviewList from "./ReviewList";
import ReviewForm from "./ReviewForm";

export default function TourReviewsSection({ tourId }: { tourId: number }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const load = async () => {
    const res = await fetch("/api/reviews");
    if (res.ok) {
      const data: Review[] = await res.json();
      setReviews(data.filter((r) => r.tourId === tourId));
    }
  };
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourId]);

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Đánh giá</h2>
      <ReviewForm tourId={tourId} onCreated={load} />
      <ReviewList reviews={reviews} />
    </div>
  );
}