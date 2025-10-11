import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { Tour, Review } from "@/src/lib/types";

async function getTour(id: string): Promise<Tour | null> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const res = await fetch(`${base}/api/tours/${id}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  return res.json();
}

async function getReviews(): Promise<Review[]> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const res = await fetch(`${base}/api/reviews`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  return res.json();
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const tour = await getTour(params.id);
  const baseFrontend = process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";
  if (!tour) {
    return { title: "Tour không tồn tại" };
  }
  const title = `${tour.title} | TravelGo`;
  const description = `${tour.location} • ${tour.duration} • Giá ${new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(tour.price)}`;
  const url = `${baseFrontend}/tours/${params.id}`;
  const images = [{ url: tour.image || "/next.svg", alt: tour.title }];
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((i) => i.url),
    },
  };
}

export default async function TourDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { status?: "success" | "cancel" };
}) {
  const tour = await getTour(params.id);
  if (!tour) return notFound();
  const reviews = (await getReviews()).filter((r) => r.tourId === tour.id);

  const status = searchParams?.status;

  return (
    <div className="py-8 space-y-6">
      {status && (
        <div
          className={`rounded p-3 text-sm ${
            status === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {status === "success"
            ? "Thanh toán thành công. Cảm ơn bạn!"
            : "Thanh toán bị hủy. Vui lòng thử lại."}
        </div>
      )}

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
        {/* Booking + Payment + Favorite */}
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-expect-error Server Component using client child is fine here */}
        {await (async () => {
          const { default: BookingForm } = await import("@/src/components/BookingForm");
          const { default: PaymentButton } = await import("@/src/components/PaymentButton");
          const { default: FavoriteButton } = await import("@/src/components/FavoriteButton");
          return (
            <div className="flex items-center gap-2 mt-4">
              <BookingForm tourId={tour.id} />
              <PaymentButton tourId={tour.id} title={tour.title} amount={tour.price} />
              <FavoriteButton tourId={tour.id} />
            </div>
          );
        })()}
      </div>

      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-expect-error Server Component using client child is fine here */}
      {await (async () => {
        const { default: TourReviewsSection } = await import("@/src/components/TourReviewsSection");
        return <TourReviewsSection tourId={tour.id} />;
      })()}
    </div>
  );
}