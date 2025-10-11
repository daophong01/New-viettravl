import { NextResponse } from "next/server";
import { users } from "@/src/lib/mockData";

export async function POST(req: Request) {
  const { name, email } = await req.json();
  if (!name || !email) {
    return NextResponse.json({ error: "Missing name or email" }, { status: 400 });
  }
  const exists = users.find((u) => u.email === email);
  if (exists) {
    return NextResponse.json({ error: "Email đã tồn tại" }, { status: 409 });
  }
  const user = { id: users.length + 1, name, email, role: "user" as const };
  users.push(user);
  return NextResponse.json({ user, token: "mock-jwt-token" }, { status: 201 });
}