import { NextResponse } from "next/server";
import { users } from "@/src/lib/mockData";

export async function POST(req: Request) {
  const { email } = await req.json();
  const user = users.find((u) => u.email === email) ?? users[0];
  return NextResponse.json({
    token: "mock-jwt-token",
    user,
  });
}