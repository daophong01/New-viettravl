import Image from "next/image";
import Link from "next/link";
import TourCard from "@/src/components/TourCard";
import { Tour } from "@/src/lib/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TravelGo - Travel Booking Website",
  description: "Đặt tour du lịch dễ dàng với TravelGo",
  openGraph: {
    title: "TravelGo - Travel Booking Website",
    description: "Đặt tour du lịch dễ dàng với TravelGo",
    url: (process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000") + "/",
    images: [{ url: "/next.svg", alt: "TravelGo" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TravelGo - Travel Booking Website",
    description: "Đặt tour du lịch dễ dàng với TravelGo",
    images: ["/next.svg"],
  },
};

async function getTours(): Promise<Tour[]> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const res = await fetch(`${base}/api/tours?page=1&pageSize=100`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : data.items || [];
}

export default async function Home() {
  const tours = await getTours();

  return (
    <div className="space-y-10 py-8">
      <section className="rounded-lg bg-black/5 dark:bg-white/10 p-6 flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 space-y-3">
          <h1 className="text-2xl md:text-3xl font-bold">
            Khám phá thế giới cùng TravelGo
          </h1>
          <p className="text-sm md:text-base text-black/70 dark:text-white/70">
            Đặt tour du lịch dễ dàng, nhanh chóng. Ưu đãi hấp dẫn cho các điểm đến hot!
          </p>
          <div className="flex gap-2">
            <Link
              href="/tours"
              className="px-4 py-2 rounded bg-foreground text-background text-sm hover:opacity-90"
            >
              Khám phá Tours
            </Link>
            <Link
              href="/auth/register"
              className="px-4 py-2 rounded border border-black/10 dark:border-white/15 text-sm hover:bg-black/5"
            >
              Đăng ký ngay
            </Link>
          </div>
        </div>
        <div className="relative w-full md:w-80 h-40 md:h-48">
          <Image
            src="/next.svg"
            alt="Travel hero"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Tours nổi bật</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.slice(0, 3).map((t) => (
            <TourCard key={t.id} tour={t} />
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Đánh giá khách hàng</h2>
        <p className="text-sm text-black/70 dark:text-white/70">
          Hơn 10,000 khách hàng tin tưởng TravelGo cho hành trình của họ.
        </p>
      </section>
    </div>
  );
}
