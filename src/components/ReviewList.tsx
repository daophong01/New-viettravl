import { Review } from "@/src/lib/types";
import RatingStars from "./RatingStars";

export default function ReviewList({ reviews }: { reviews: Review[] }) {
  if (!reviews.length) {
    return (
      <p className="text-sm text-black/70 dark:text-white/70">Chưa có đánh giá</p>
    );
  }
  return (
    <div className="space-y-3">
      {reviews.map((r) => (
        <div key={r.id} className="border rounded p-3">
          <div className="flex items-center justify-between">
            <RatingStars value={r.rating} size="sm" />
            <span className="text-xs text-black/60 dark:text-white/60">
              {new Date(r.createdAt).toLocaleDateString("vi-VN")}
            </span>
          </div>
          <p className="text-sm mt-2">{r.comment}</p>
        </div>
      ))}
    </div>
  );
}