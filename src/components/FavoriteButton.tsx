"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/src/store/auth";
import { useToast } from "@/src/store/toast";

export default function FavoriteButton({ tourId }: { tourId: number }) {
  const token = useAuth((s) => s.token);
  const push = useToast((s) => s.push);
  const [favorited, setFavorited] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    if (!token) {
      setFavorited(false);
      return;
    }
    const res = await fetch(`${base}/api/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const items = await res.json();
      const ids = items.map((i: any) => i.tourId);
      setFavorited(ids.includes(tourId));
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, tourId]);

  const toggle = async () => {
    if (!token) {
      push({ text: "Vui lòng đăng nhập để thêm vào yêu thích", type: "info" });
      return;
    }
    setLoading(true);
    try {
      const before = favorited;
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const res = await fetch(`${base}/api/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tourId }),
      });
      if (res.ok) {
        const data = await res.json();
        setFavorited(data.favorited);
        const delta = data.favorited === true && !before ? 1 : data.favorited === false && before ? -1 : 0;
        window.dispatchEvent(new CustomEvent("fav-changed", { detail: { delta } }));
        push({
          text: data.favorited ? "Đã thêm vào yêu thích" : "Đã bỏ khỏi yêu thích",
          type: "success",
        });
      } else {
        const err = await res.json().catch(() => ({}));
        push({ text: err.error || "Thao tác thất bại", type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="px-3 py-2 rounded border hover:bg-black/5"
      aria-label="Yêu thích"
    >
      {favorited ? "♥ Bỏ yêu thích" : "♡ Thêm yêu thích"}
    </button>
  );
}