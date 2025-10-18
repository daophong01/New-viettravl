import type { Metadata } from "next";
import dynamic from "next/dynamic";

const ContactForm = dynamic(() => import("@/src/components/ContactForm"), { ssr: false });

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
    <div className="py-8 space-y-8">
      <section className="space-y-3">
        <h1 className="text-2xl font-bold">Liên hệ</h1>
        <p className="text-sm text-black/70 dark:text-white/70">
          Chúng tôi luôn sẵn sàng hỗ trợ bạn. Gọi hotline hoặc gửi form bên dưới, đội ngũ TravelGo sẽ phản hồi sớm nhất.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded border p-3">
            <div className="font-semibold">Hotline</div>
            <div className="text-sm">1900 1234</div>
          </div>
          <div className="rounded border p-3">
            <div className="font-semibold">Email</div>
            <div className="text-sm">support@travelgo.example</div>
          </div>
          <div className="rounded border p-3">
            <div className="font-semibold">Giờ làm việc</div>
            <div className="text-sm">08:00–21:00 (T2–CN)</div>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Gửi liên hệ</h2>
        <ContactForm />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Văn phòng</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded border p-3">
            <div className="font-semibold">Hà Nội</div>
            <div className="text-sm">Tầng 10, Tòa ABC, Quận Cầu Giấy</div>
          </div>
          <div className="rounded border p-3">
            <div className="font-semibold">TP.HCM</div>
            <div className="text-sm">Tầng 8, Tòa XYZ, Quận 1</div>
          </div>
        </div>
      </section>
    </div>
  );
}