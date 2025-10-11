"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="py-16 text-center space-y-3">
      <h1 className="text-2xl font-bold">Có lỗi xảy ra</h1>
      <p className="text-sm text-black/70 dark:text-white/70">
        {error.message || "Vui lòng thử lại."}
      </p>
      <button
        className="px-4 py-2 rounded border hover:bg-black/5"
        onClick={() => reset()}
      >
        Thử lại
      </button>
    </div>
  );
}