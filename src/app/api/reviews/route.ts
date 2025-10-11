import { NextResponse } from "next/server";
import { reviews } from "@/src/lib/mockData";

export async function GET() {
  return NextResponse.json(reviews);
}