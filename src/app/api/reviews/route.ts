import { NextResponse } from "next/server";
import { reviews } from "@/src/lib/mockData";

export async function GET() {
  return NextResponse.json(reviews);
}

export async function POST(req: Request) {
  const { userId, tourId, rating, comment } = await req.json();
  if (!userId || !tourId || !rating) {
    return NextResponse.json({ error: "Thiếu trường bắt buộc" }, { status: 400 });
  }
  const review = {
    id: reviews.length ? Math.max(...reviews.map((r) => r.id)) + 1 : 1,
    userId: Number(userId),
    tourId: Number(tourId),
    rating: Number(rating),
    comment: comment || "",
    createdAt: new Date().toISOString(),
  };
  reviews.push(review);
  return NextResponse.json(review, { status: 201 });
}