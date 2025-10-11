"use client";

import { useState } from "react";

export default function ImageUpload({
  onUploaded,
  folder = "travelgo/tours",
  maxSizeMB = 5,
  publicId,
}: {
  onUploaded: (url: string) => void;
  folder?: string;
  maxSizeMB?: number;
  publicId?: string;
}) {
  const [loading, setLoading] = useState(false);

  const handleFile = async (file: File) => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`Ảnh vượt quá ${maxSizeMB}MB. Vui lòng chọn ảnh khác.`);
      return;
    }
    setLoading(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const pid = publicId || `tour_${Date.now()}`;
      const signRes = await fetch(
        `${base}/api/upload/sign?folder=${encodeURIComponent(folder)}&public_id=${encodeURIComponent(pid)}`
      );
      if (!signRes.ok) {
        setLoading(false);
        return;
      }
      const { cloudName, apiKey, timestamp, signature, folder: signedFolder, public_id } = await signRes.json();

      const form = new FormData();
      form.append("file", file);
      form.append("api_key", apiKey);
      form.append("timestamp", String(timestamp));
      form.append("signature", signature);
      if (signedFolder) form.append("folder", signedFolder);
      if (public_id) form.append("public_id", public_id);

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