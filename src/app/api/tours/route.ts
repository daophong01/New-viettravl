import { NextResponse } from "next/server";
import { tours } from "@/src/lib/mockData";

export async function GET() {
  return NextResponse.json(tours);
}