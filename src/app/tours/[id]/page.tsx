import { notFound } from "next/navigation";
import Image from "next/image";
import { Tour, Review } from "@/src/lib/types";

async function getTour(id: string): Promise<Tour | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/tours/${id}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  return res.json();
}

async function getReviews(): Promise<Review[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/reviews`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function TourDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const tour = await getTour(params.id);
  if (!tour) return notFound();
  const reviews = (await getReviews()).filter((r) => r.tourId === tour.id);

  return (
    <div className="py-8 space-y-6">
      <div className="relative w-full h-56 md:h-80 rounded-lg overflow-hidden">
        <Image
          src={tour.image || "/next.svg"}
          alt={tour.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{tour.title}</h1>
        <p className="text-black/70 dark:text-white/70">{tour.location} • {tour.duration}</p>
        <p className="font-semibold">
          {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(tour.price)}
        </p>
        <p className="text-sm leading-relaxed">{tour.description}</p>
        <div className="flex items-center gap-2 text-sm"><span>⭐ {tour.rating.toFixed(1)}</span></div>
        {/* Booking */}
        {/* Client booking form */}
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-expect-error Server Component using client child is fine here */}
        {await (async () => {
          const { default: BookingForm } = await import("@/src/components/BookingForm");
          return <BookingForm tourId={tour.id} />;
        })()}
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Đánh giá</h2>
        {reviews.length === 0 ? (
          <p className="text-sm text-black/70 dark:text-white/70">Chưa có đánh giá</p>
        ) : (
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className="border rounded p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">⭐ {r.rating}</span>
                  <span className="text-xs text-black/60 dark:text-white/60">
                    {new Date(r.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <p className="text-sm mt-2">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}