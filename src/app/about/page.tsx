import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giới thiệu | TravelGo",
  description: "Giới thiệu về TravelGo - nền tảng đặt tour du lịch thân thiện.",
  alternates: { canonical: (process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000") + "/about" },
  openGraph: {
    title: "Giới thiệu | TravelGo",
    description: "Giới thiệu về TravelGo - nền tảng đặt tour du lịch thân thiện.",
    url: (process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000") + "/about",
    images: [{ url: "/next.svg", alt: "TravelGo" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Giới thiệu | TravelGo",
    description: "Giới thiệu về TravelGo - nền tảng đặt tour du lịch thân thiện.",
    images: ["/next.svg"],
  },
};

export default function AboutPage() {
  return (
    <div className="py-8 space-y-3">
      <h1 className="text-2xl font-bold">Giới thiệu TravelGo</h1>
      <p className="text-sm leading-relaxed">
        TravelGo là nền tảng đặt tour du lịch thân thiện, mang đến trải nghiệm tốt nhất cho khách hàng.
      </p>
    </div>
  );
}