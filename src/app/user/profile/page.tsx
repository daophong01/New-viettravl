"use client";

import { useAuth } from "@/src/store/auth";

export default function UserProfilePage() {
  const user = useAuth((s) => s.user);

  if (!user) {
    return (
      <div className="py-8">
        <h1 className="text-2xl font-bold">Hồ sơ</h1>
        <p className="text-sm">Bạn cần đăng nhập để xem hồ sơ.</p>
      </div>
    );
  }

  return (
    <div className="py-8 space-y-6">
      <h1 className="text-2xl font-bold">Hồ sơ</h1>
      <div className="flex items-center gap-4">
        {user.avatar ? (
          <img src={user.avatar} alt="avatar" className="w-20 h-20 rounded-full object-cover border" />
        ) : (
          <div className="w-20 h-20 rounded-full border bg-black/5" />
        )}
        <div>
          <div className="text-lg font-semibold">{user.name}</div>
          <div className="text-sm text-black/70 dark:text-white/70">{user.email}</div>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm">Vai trò: {user.role}</p>
        <p className="text-sm">Trạng thái: {user.status || "active"}</p>
      </div>
    </div>
  );
}