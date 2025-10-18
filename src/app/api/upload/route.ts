import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
  const API_KEY = process.env.CLOUDINARY_API_KEY;
  const API_SECRET = process.env.CLOUDINARY_API_SECRET;

  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    return NextResponse.json(
      { error: "Cloudinary chưa cấu hình" },
      { status: 501 }
    );
  }

  const { imageBase64 } = await req.json();
  if (!imageBase64) {
    return NextResponse.json({ error: "Thiếu imageBase64" }, { status: 400 });
  }

  // Upload trực tiếp qua REST API
  const form = new FormData();
  form.append("file", imageBase64);
  form.append("upload_preset", "unsigned"); // Khuyến nghị dùng signed; cấu hình preset phù hợp
  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: form }
    );
    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: 502 });
    }
    const json = await res.json();
    return NextResponse.json(json);
  } catch (e) {
    return NextResponse.json({ error: "Upload thất bại" }, { status: 500 });
  }
}