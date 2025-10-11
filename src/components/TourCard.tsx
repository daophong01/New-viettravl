import Image from "next/image";
import Link from "next/link";
import { Tour } from "@/src/lib/types";

export default function TourCard({ tour }: { tour: Tour }) {
  return (
    <div className="rounded-lg border border-black/10 dark:border-white/15 overflow-hidden bg-background">
      <div className="relative h-40 w-full">
        <Image
          src={tour.image || "/next.svg"}
          alt={tour.title}
          fill
          className="object-cover"
        />
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