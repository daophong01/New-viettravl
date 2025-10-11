import { NextResponse } from "next/server";
import { tours } from "@/src/lib/mockData";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  const tour = tours.find((t) => t.id === id);
  if (!tour) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(tour);
}