"use client";

import { useMemo, useState } from "react";
import { useToast } from "@/src/store/toast";

function passwordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0..5
}

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetting, setResetting] = useState(false);
  const push = useToast((s) => s.push);

  const strength = useMemo(() => passwordStrength(newPassword), [newPassword]);

  const reset = async () => {
    if (!email || !code || !newPassword) {
      push({ text: "Vui lòng nhập đầy đủ email, mã, mật khẩu mới", type: "info" });
      return;
    }
    if (strength < 3) {
      push({ text: "Mật khẩu mới quá yếu. Vui lòng dùng ít nhất 8 ký tự, gồm chữ hoa, chữ thường và số.", type: "error" });
      return;
    }
    setResetting(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const res = await fetch(`${base}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });
      if (res.ok) {
        push({ text: "Đặt lại mật khẩu thành công. Vui lòng đăng nhập.", type: "success" });
        setEmail("");
        setCode("");
        setNewPassword("");
      } else {
        const err = await res.json().catch(() => ({}));
        push({ text: err.error || "Đặt lại mật khẩu thất bại", type: "error" });
      }
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="py-8 space-y-4">
      <h1 className="text-2xl font-bold">Đặt lại mật khẩu</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          className="border rounded px-3 py-2 w-full"
          type="email"
          placeholder="Email của bạn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Mã xác nhận"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <div className="space-y-2">
          <input
            className="border rounded px-3 py-2 w-full"
            type="password"
            placeholder="Mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <div className="h-2 rounded bg-black/10 dark:bg.white/10 overflow-hidden">
            <div
              className={`h-2 ${strength <= 2 ? "bg-red-500" : strength === 3 ? "bg-yellow-500" : "bg-green-600"}`}
              style={{ width: `${(strength / 5) * 100}%` }}
            />
          </div>
          <div className="text-xs text-black/60 dark:text-white/60">
            Độ mạnh mật khẩu: {strength}/5 (ít nhất 8 ký tự, có chữ hoa, chữ thường, số, ký tự đặc biệt)
          </div>
        </div>
      </div>
      <button
        className="px-4 py-2 rounded bg-foreground text-background"
        onClick={reset}
        disabled={resetting}
      >
        {resetting ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
      </button>
    </div>
  );
}