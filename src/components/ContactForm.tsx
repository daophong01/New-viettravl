"use client";

import { useState } from "react";
import { useToast } from "@/src/store/toast";

export default function ContactForm() {
  const push = useToast((s) => s.push);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!message.trim()) {
      push({ text: "Vui lòng nhập nội dung.", type: "error" });
      return;
    }
    setLoading(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const res = await fetch(`${base}/api/support/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.ok) {
        push({ text: "Gửi liên hệ thành công. Chúng tôi sẽ phản hồi sớm.", type: "success" });
        setName("");
        setEmail("");
        setMessage("");
      } else {
        push({ text: "Gửi liên hệ thất bại.", type: "error" });
      }
    } catch {
      push({ text: "Lỗi mạng. Vui lòng thử lại.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Họ tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <textarea
        className="border rounded px-3 py-2 w-full h-32"
        placeholder="Nội dung liên hệ..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        onClick={submit}
        disabled={loading}
        className="px-4 py-2 rounded bg-foreground text-background text-sm hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Đang gửi..." : "Gửi liên hệ"}
      </button>
    </div>
  );
}