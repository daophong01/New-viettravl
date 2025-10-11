import { NextResponse } from "next/server";
import { bookings } from "@/src/lib/mockData";

export async function GET() {
  return NextResponse.json(bookings);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, tourId } = body || {};
  if (!userId || !tourId) {
    return NextResponse.json({ error: "Missing userId or tourId" }, { status: 400 });
  }
  const booking = {
    id: bookings.length + 1,
    userId: Number(userId),
    tourId: Number(tourId),
    status: "booked" as const,
    createdAt: new Date().toISOString(),
  };
  bookings.push(booking);
  return NextResponse.json(booking, { status: 201 });
}