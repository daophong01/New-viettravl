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
    <div className="py-8 space-y-8">
      <section className="space-y-3">
        <h1 className="text-2xl font-bold">Giới thiệu TravelGo</h1>
        <p className="text-sm leading-relaxed text-black/70 dark:text-white/70">
          TravelGo là nền tảng đặt tour du lịch thân thiện, giúp bạn khám phá thế giới với quy trình đơn giản,
          minh bạch và an toàn.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Giá trị cốt lõi</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded border p-3">
            <div className="font-semibold">Trải nghiệm mượt mà</div>
            <div className="text-sm">Đặt tour chỉ vài bước, giao diện thân thiện, tốc độ nhanh.</div>
          </div>
          <div className="rounded border p-3">
            <div className="font-semibold">Minh bạch giá</div>
            <div className="text-sm">Giá hiển thị rõ ràng, không phí ẩn, nhiều ưu đãi hấp dẫn.</div>
          </div>
          <div className="rounded border p-3">
            <div className="font-semibold">Hỗ trợ tận tâm</div>
            <div className="text-sm">Đội ngũ sẵn sàng hỗ trợ 24/7 trước–trong–sau chuyến đi.</div>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Hành trình phát triển</h2>
        <div className="space-y-2 text-sm">
          <div className="rounded border p-3">2022 — Khởi động dự án TravelGo</div>
          <div className="rounded border p-3">2023 — Ra mắt phiên bản web, 50+ đối tác du lịch</div>
          <div className="rounded border p-3">2024 — Tích hợp thanh toán Stripe, Cloudinary, mở rộng 5 quốc gia</div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Câu hỏi thường gặp (FAQ)</h2>
        <div className="space-y-2">
          <div className="rounded border p-3">
            <div className="font-semibold">Làm sao để đặt tour?</div>
            <div className="text-sm">Chọn tour yêu thích, điền thông tin, thanh toán là xong.</div>
          </div>
          <div className="rounded border p-3">
            <div className="font-semibold">Có thể hủy/hoàn tiền không?</div>
            <div className="text-sm">Bạn có thể yêu cầu hủy hoặc hoàn tiền theo chính sách của tour.</div>
          </div>
        </div>
      </section>
    </div>
  );
}