"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function PaymentResultPage() {
  const search = useSearchParams();
  const status = search.get("status");
  const tourId = search.get("tourId");

  const success = status === "success";

  return (
    <div className="py-8 space-y-4">
      <h1 className="text-2xl font-bold">Kết quả thanh toán</h1>
      <div
        className={`rounded p-3 text-sm ${
          success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
      >
        {success ? "Thanh toán thành công. Cảm ơn bạn!" : "Thanh toán bị hủy hoặc thất bại."}
      </div>
      <div className="flex gap-2">
        {tourId && (
          <Link
            href={`/tours/${tourId}`}
            className="px-4 py-2 rounded border hover:bg-black/5"
          >
            Quay lại tour
          </Link>
        )}
        <Link href="/tours" className="px-4 py-2 rounded border hover:bg-black/5">
          Xem thêm tours
        </Link>
      </div>
    </div>
  );
}