"use client";

import { useState } from "react";

export default function ImageUpload({
  onUploaded,
}: {
  onUploaded: (url: string) => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleFile = async (file: File) => {
    setLoading(true);
    try {
      // Get signed params from backend
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const signRes = await fetch(`${base}/api/upload/sign`);
      if (!signRes.ok) {
        setLoading(false);
        return;
      }
      const { cloudName, apiKey, timestamp, signature } = await signRes.json();

      const form = new FormData();
      form.append("file", file);
      form.append("api_key", apiKey);
      form.append("timestamp", String(timestamp));
      form.append("signature", signature);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: form }
      );
      const json = await uploadRes.json();
      onUploaded(json.secure_url || json.url);
    } finally {
      setLoading(false);
    }
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