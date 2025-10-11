"use client";

type Props = {
  value: number;
  onChange?: (v: number) => void;
  size?: "sm" | "md";
};

export default function RatingStars({ value, onChange, size = "md" }: Props) {
  const stars = [1, 2, 3, 4, 5];
  const cls = size === "sm" ? "text-sm" : "text-base";
  return (
    <div className={`flex items-center gap-1 ${cls}`}>
      {stars.map((s) => {
        const active = s <= Math.round(value);
        return (
          <button
            key={s}
            type="button"
            onClick={() => onChange?.(s)}
            className={`px-1 rounded ${onChange ? "hover:bg-black/5" : ""}`}
            aria-label={`Đánh giá ${s} sao`}
          >
            {active ? "★" : "☆"}
          </button>
        );
      })}
    </div>
  );
}