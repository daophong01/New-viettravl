import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liên hệ | TravelGo",
  description: "Liên hệ TravelGo để được hỗ trợ đặt tour và thông tin dịch vụ.",
  alternates: { canonical: (process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000") + "/contact" },
  openGraph: {
    title: "Liên hệ | TravelGo",
    description: "Liên hệ TravelGo để được hỗ trợ đặt tour và thông tin dịch vụ.",
    url: (process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000") + "/contact",
    images: [{ url: "/next.svg", alt: "TravelGo" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Liên hệ | TravelGo",
    description: "Liên hệ TravelGo để được hỗ trợ đặt tour và thông tin dịch vụ.",
    images: ["/next.svg"],
  },
};

export default function ContactPage() {
  return (
    <div className="py-8 space-y-3">
      <h1 className="text-2xl font-bold">Liên hệ</h1>
      <p className="text-sm">Email: support@travelgo.example</p>
      <p className="text-sm">Hotline: 1900 1234</p>
    </div>
  );
}