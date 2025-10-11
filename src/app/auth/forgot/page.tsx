"use client";

import { useState } from "react";
import { useToast } from "@/src/store/toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(null);
  const push = useToast((s) => s.push);

  const send = async () => {
    if (!email) {
      push({ text: "Vui lòng nhập email", type: "info" });
      return;
    }
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const res = await fetch(`${base}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setSent(true);
    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      if (data?.code) setDevCode(data.code);
      push({ text: "Đã gửi mã đặt lại mật khẩu", type: "success" });
    } else {
      const err = await res.json().catch(() => ({}));
      push({ text: err.error || "Gửi mã thất bại", type: "error" });
    }
  };

  return (
    <div className="py-8 space-y-4">
      <h1 className="text-2xl font-bold">Quên mật khẩu</h1>
      <p className="text-sm">Nhập email của bạn để yêu cầu mã đặt lại mật khẩu. (Dev: mã hiển thị để test)</p>
      <div className="space-y-2">
        <input
          className="border rounded px-3 py-2 w-full"
          type="email"
          placeholder="Email của bạn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="px-4 py-2 rounded bg-foreground text-background" onClick={send}>
          Gửi mã
        </button>
      </div>
      {sent && (
        <div className="text-sm">
          Mã đã được gửi (dev: nếu có code hiển thị: {devCode || "đã gửi tới email"}). Vui lòng vào trang Đặt lại mật khẩu.
        </div>
      )}
    </div>
  );
}