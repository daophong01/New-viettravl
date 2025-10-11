"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      router.push("/");
    }
  };

  return (
    <div className="py-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Đăng ký</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="text"
          required
          placeholder="Họ và tên"
          className="border rounded px-3 py-2 w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          required
          placeholder="Email"
          className="border rounded px-3 py-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 rounded bg-foreground text-background w-full"
        >
          Tạo tài khoản
        </button>
      </form>
    </div>
  );
}