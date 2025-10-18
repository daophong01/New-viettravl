import { NextResponse } from "next/server";
import { tours } from "@/src/lib/mockData";

export async function GET() {
  return NextResponse.json(tours);
}

export async function POST(req: Request) {
  const payload = await req.json();
  const { title, location, price, duration, image, description } = payload || {};
  if (!title || !location || !price || !duration) {
    return NextResponse.json({ error: "Thiếu trường bắt buộc" }, { status: 400 });
  }
  const tour = {
    id: tours.length ? Math.max(...tours.map((t) => t.id)) + 1 : 1,
    title,
    location,
    price: Number(price),
    duration,
    image: image || "/next.svg",
    description: description || "",
    rating: 0,
  };
  tours.push(tour);
  return NextResponse.json(tour, { status: 201 });
}