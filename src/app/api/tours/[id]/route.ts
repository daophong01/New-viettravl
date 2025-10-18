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

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  const idx = tours.findIndex((t) => t.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const payload = await req.json();
  tours[idx] = { ...tours[idx], ...payload, id };
  return NextResponse.json(tours[idx]);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  const idx = tours.findIndex((t) => t.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const [removed] = tours.splice(idx, 1);
  return NextResponse.json(removed);
}