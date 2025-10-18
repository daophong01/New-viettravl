"use client";
import type { Metadata } from "next";
import ToursClient from "./ToursClient";

export const metadata: Metadata = {
  title: "Tours | TravelGo",
  description: "Danh sách tour du lịch hấp dẫn trên TravelGo.",
  alternates: { canonical: (process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000") + "/tours" },
  openGraph: {
    title: "Tours | TravelGo",
    description: "Danh sách tour du lịch hấp dẫn trên TravelGo.",
    url: (process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000") + "/tours",
    images: [{ url: "/next.svg", alt: "TravelGo" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tours | TravelGo",
    description: "Danh sách tour du lịch hấp dẫn trên TravelGo.",
    images: ["/next.svg"],
  },
};

export default function ToursPage() {
  return <ToursClient />;
}