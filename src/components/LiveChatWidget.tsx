"use client";

import { useState } from "react";
import { useAuth } from "@/src/store/auth";

export default function LiveChatWidget() {
  const user = useAuth((s) => s.user);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const [aiMode, setAiMode] = useState(false);
  const [aiReply, setAiReply] = useState<string | null>(null);

  const submit = async () => {
    if (!message.trim()) return;
    setSending(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      if (aiMode) {
        const res = await fetch(`${base}/api/support/ai`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        });
        if (res.ok) {
          const data = await res.json();
          setAiReply(data.reply || "Không có phản hồi.");
        }
      } else {
        const res = await fetch(`${base}/api/support/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, message }),
        });
        if (res.ok) {
          setMessage("");
          setSent(true);
          setTimeout(() => setSent(false), 3000);
        }
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!open ? (
        <button
          className="px-4 py-2 rounded bg-foreground text-background shadow hover:opacity-90"
          onClick={() => setOpen(true)}
        >
          Hỗ trợ
        </button>
      ) : (
        <div className="w-80 rounded-lg border bg-background shadow-lg">
          <div className="flex items-center justify-between px-3 py-2 border-b">
            <strong>Live Chat Hỗ trợ</strong>
            <button className="text-sm" onClick={() => setOpen(false)}>Đóng</button>
          </div>
          <div className="p-3 space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-xs flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={aiMode}
                  onChange={(e) => setAiMode(e.target.checked)}
                />
                Dùng trợ lý AI
              </label>
            </div>
            {!aiMode && (
              <>
                <input
                  className="border rounded px-2 py-1 w-full text-sm"
                  placeholder="Tên của bạn"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  className="border rounded px-2 py-1 w-full text-sm"
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </>
            )}
            <textarea
              className="border rounded px-2 py-1 w-full text-sm"
              placeholder={aiMode ? "Hỏi trợ lý AI..." : "Tin nhắn..."}
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              className="px-3 py-2 rounded bg-foreground text-background text-sm hover:opacity-90 w-full"
              onClick={submit}
              disabled={sending}
            >
              {sending ? "Đang gửi..." : aiMode ? "Hỏi AI" : "Gửi"}
            </button>
            {aiMode && aiReply && (
              <div className="text-xs bg-black/5 dark:bg-white/10 rounded p-2">
                <strong>Phản hồi AI:</strong>
                <div className="mt-1 whitespace-pre-line">{aiReply}</div>
              </div>
            )}
            {!aiMode && sent && <div className="text-xs text-green-700">Đã gửi tin nhắn, chúng tôi sẽ phản hồi sớm.</div>}
          </div>
        </div>
      )}
    </div>
  );
}