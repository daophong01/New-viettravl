import Image from "next/image";
import Link from "next/link";
import { Tour } from "@/src/lib/types";
import { useAuth } from "@/src/store/auth";
import { useToast } from "@/src/store/toast";
import { useEffect, useState } from "react";

export default function TourCard({ tour, isFavorited }: { tour: Tour; isFavorited?: boolean }) {
  const token = useAuth((s) => s.token);
  const push = useToast((s) => s.push);
  const [favLoading, setFavLoading] = useState(false);
  const [favorited, setFavorited] = useState<boolean>(!!isFavorited);

  useEffect(() => {
    setFavorited(!!isFavorited);
  }, [isFavorited]);

  const toggleFavorite = async () => {
    if (!token) {
      push({ text: "Vui lòng đăng nhập để thêm vào yêu thích", type: "info" });
      return;
    }
    setFavLoading(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const res = await fetch(`${base}/api/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({ tourId: tour.id }),
      });
      if (res.ok) {
        const data = await res.json();
        setFavorited(data.favorited);
        push({
          text: data.favorited ? "Đã thêm vào yêu thích" : "Đã bỏ khỏi yêu thích",
          type: "success",
        });
      } else {
        const err = await res.json().catch(() => ({}));
        push({ text: err.error || "Thao tác thất bại", type: "error" });
      }
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-black/10 dark:border-white/15 overflow-hidden bg-background">
      <div className="relative h-40 w-full">
        <Image
          src={tour.image || "/next.svg"}
          alt={tour.title}
          fill
          className="object-cover"
        />
        <button
          onClick={toggleFavorite}
          disabled={favLoading}
          className="absolute top-2 right-2 rounded-full bg-white/80 backdrop-blur px-3 py-1 text-sm border hover:bg-white"
          aria-label="Yêu thích"
        >
          {favorited ? "♥" : "♡"}
        </button>
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-semibold">{tour.title}</h3>
        <p className="text-sm text-black/70 dark:text-white/70">{tour.location}</p>
        <p className="text-sm">{tour.duration}</p>
        <p className="font-medium">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(tour.price)}
        </p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm">⭐ {tour.rating.toFixed(1)}</span>
          <Link
            href={`/tours/${tour.id}`}
            className="px-3 py-2 rounded bg-foreground text-background text-sm hover:opacity-90"
          >
            Xem chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
}