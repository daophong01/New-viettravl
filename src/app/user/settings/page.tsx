"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/src/store/auth";
import ImageUpload from "@/src/components/ImageUpload";

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

  useEffect(() => {
    setName(user?.name || "");
    setAvatar(user?.avatar || null);
  }, [user]);

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
      }
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (!oldPassword || !newPassword) return;
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
        alert("Đổi mật khẩu thành công");
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || "Đổi mật khẩu thất bại");
      }
    } finally {
      setChanging(false);
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
          <input
            className="border rounded px-3 py-2 w-full"
            type="password"
            placeholder="Mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <button
          className="px-4 py-2 rounded border hover:bg-black/5"
          onClick={changePassword}
          disabled={changing}
        >
          {changing ? "Đang đổi..." : "Đổi mật khẩu"}
        </button>
      </section>
    </div>
  );
}