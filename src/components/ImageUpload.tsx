"use client";

import { useState } from "react";

export default function ImageUpload({
  onUploaded,
  folder = "travelgo/tours",
  maxSizeMB = 5,
}: {
  onUploaded: (url: string) => void;
  folder?: string;
  maxSizeMB?: number;
}) {
  const [loading, setLoading] = useState(false);

  const handleFile = async (file: File) => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`Ảnh vượt quá ${maxSizeMB}MB. Vui lòng chọn ảnh khác.`);
      return;
    }
    setLoading(true);
    try {
      // Get signed params from backend
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const signRes = await fetch(`${base}/api/upload/sign?folder=${encodeURIComponent(folder)}`);
      if (!signRes.ok) {
        setLoading(false);
        return;
      }
      const { cloudName, apiKey, timestamp, signature, folder: signedFolder } = await signRes.json();

      const form = new FormData();
      form.append("file", file);
      form.append("api_key", apiKey);
      form.append("timestamp", String(timestamp));
      form.append("signature", signature);
      if (signedFolder) form.append("folder", signedFolder);

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