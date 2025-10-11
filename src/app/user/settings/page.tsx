"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/src/store/auth";
import ImageUpload from "@/src/components/ImageUpload";
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

export default function UserSettingsPage() {
  const user = useAuth((s) => s.user);
  const token = useAuth((s) => s.token);
  const setUser = useAuth((s) => s.setUser);

  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState<string | null>(user?.avatar || null);
  const [avatarPublicId, setAvatarPublicId] = useState<string | null>(null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changing, setChanging] = useState(false);
  const [saving, setSaving] = useState(false);

  // Email change
  const [newEmail, setNewEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [emailRequested, setEmailRequested] = useState(false);

  const newPwStrength = useMemo(() => passwordStrength(newPassword), [newPassword]);

  useEffect(() => {
    setName(user?.name || "");
    setAvatar(user?.avatar || null);
  }, [user]);

  const push = useToast((s) => s.push);

  const saveProfile = async () => {
    setSaving(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const res = await fetch(`${base}/api/auth/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({ name, avatar, avatarPublicId }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser({ ...(user || {}), name: data.name, avatar: data.avatar });
        push({ text: "Đã lưu thay đổi hồ sơ", type: "success" });
      } else {
        const err = await res.json().catch(() => ({}));
        push({ text: err.error || "Lưu thất bại", type: "error" });
      }
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (!oldPassword || !newPassword) {
      push({ text: "Vui lòng nhập đầy đủ mật khẩu hiện tại và mật khẩu mới", type: "info" });
      return;
    }
    if (newPwStrength < 3) {
      push({ text: "Mật khẩu mới quá yếu. Vui lòng dùng ít nhất 8 ký tự, gồm chữ hoa, chữ thường và số.", type: "error" });
      return;
    }
    setChanging(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const res = await fetch(`${base}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      if (res.ok) {
        setOldPassword("");
        setNewPassword("");
        push({ text: "Đổi mật khẩu thành công", type: "success" });
      } else {
        const err = await res.json().catch(() => ({}));
        push({ text: err.error || "Đổi mật khẩu thất bại", type: "error" });
      }
    } finally {
      setChanging(false);
    }
  };

  const requestEmailChange = async () => {
    if (!newEmail) {
      push({ text: "Vui lòng nhập email mới", type: "info" });
      return;
    }
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const res = await fetch(`${base}/api/auth/request-email-change`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      },
      body: JSON.stringify({ newEmail }),
    });
    if (res.ok) {
      setEmailRequested(true);
      const data = await res.json().catch(() => ({}));
      if (data?.code) push({ text: `Mã xác nhận (dev): ${data.code}`, type: "info" });
      push({ text: "Đã gửi mã xác nhận tới email mới", type: "success" });
    } else {
      const err = await res.json().catch(() => ({}));
      push({ text: err.error || "Yêu cầu đổi email thất bại", type: "error" });
    }
  };

  const confirmEmailChange = async () => {
    if (!emailCode) {
      push({ text: "Vui lòng nhập mã xác nhận", type: "info" });
      return;
    }
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const res = await fetch(`${base}/api/auth/confirm-email-change`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      },
      body: JSON.stringify({ code: emailCode }),
    });
    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      setUser({ ...(user || {}), email: data.email });
      push({ text: "Đã đổi email thành công", type: "success" });
      setEmailRequested(false);
      setEmailCode("");
      setNewEmail("");
    } else {
      const err = await res.json().catch(() => ({}));
      push({ text: err.error || "Xác nhận đổi email thất bại", type: "error" });
    }
  };

  if (!user) {
    return (
      <div className="py-8">
        <h1 className="text-2xl font-bold">Cài đặt tài khoản</h1>
        <p className="text-sm">Bạn cần đăng nhập để quản lý cài đặt.</p>
      </div>
    );
  }

  return (
    <div className="py-8 space-y-6">
      <h1 className="text-2xl font-bold">Cài đặt tài khoản</h1>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Thông tin cá nhân</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm">Tên hiển thị</label>
            <input
              className="border rounded px-3 py-2 w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm block">Avatar</label>
            {avatar ? (
              <img src={avatar} alt="avatar" className="w-20 h-20 rounded object-cover border" />
            ) : (
              <div className="w-20 h-20 rounded border bg-black/5" />
            )}
            <ImageUpload
              folder="travelgo/avatars"
              publicId={user?.id ? `avatar_${user.id}` : undefined}
              onUploaded={(url) => setAvatar(url)}
              onUploadedPublicId={(pid) => setAvatarPublicId(pid)}
            />
          </div>
        </div>
        <button
          className="px-4 py-2 rounded bg-foreground text-background"
          onClick={saveProfile}
          disabled={saving}
        >
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Đổi mật khẩu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            className="border rounded px-3 py-2 w-full"
            type="password"
            placeholder="Mật khẩu hiện tại"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <div className="space-y-2">
            <input
              className="border rounded px-3 py-2 w-full"
              type="password"
              placeholder="Mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <div className="h-2 rounded bg-black/10 dark:bg-white/10 overflow-hidden">
              <div
                className={`h-2 ${newPwStrength <= 2 ? "bg-red-500" : newPwStrength === 3 ? "bg-yellow-500" : "bg-green-600"}`}
                style={{ width: `${(newPwStrength / 5) * 100}%` }}
              />
            </div>
            <div className="text-xs text-black/60 dark:text-white/60">
              Độ mạnh mật khẩu: {newPwStrength}/5 (ít nhất 8 ký tự, có chữ hoa, chữ thường, số, ký tự đặc biệt)
            </div>
          </div>
        </div>
        <button
          className="px-4 py-2 rounded border hover:bg-black/5"
          onClick={changePassword}
          disabled={changing}
        >
          {changing ? "Đang đổi..." : "Đổi mật khẩu"}
        </button>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Đổi email (xác thực)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            className="border rounded px-3 py-2 w-full"
            type="email"
            placeholder="Email mới"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <button
            className="px-4 py-2 rounded border hover:bg-black/5"
            onClick={requestEmailChange}
          >
            Gửi mã xác nhận
          </button>
          {emailRequested && (
            <>
              <input
                className="border rounded px-3 py-2 w-full"
                placeholder="Nhập mã xác nhận"
                value={emailCode}
                onChange={(e) => setEmailCode(e.target.value)}
              />
              <button
                className="px-4 py-2 rounded bg-foreground text-background"
                onClick={confirmEmailChange}
              >
                Xác nhận đổi email
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  );
}