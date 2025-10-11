"use client";

import { useState } from "react";

export default function ImageUpload({
  onUploaded,
}: {
  onUploaded: (url: string) => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleFile = async (file: File) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setLoading(true);
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64 }),
      });
      setLoading(false);
      if (res.ok) {
        const json = await res.json();
        onUploaded(json.secure_url || json.url);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      {loading && <span className="text-sm">Đang upload...</span>}
    </div>
  );
}