"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/src/store/auth";

export default function AdminMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const user = useAuth((s) => s.user);
  const token = useAuth((s) => s.token);
  const [notifCount, setNotifCount] = useState<number>(0);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    // Close on route change
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    let timer: any;
    const loadCount = async () => {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const res = await fetch(`${base}/api/admin/notifications/unread-count`, {
        headers: { Authorization: `Bearer ${token || ""}` },
      });
      if (res.ok) {
        const data = await res.json();
        setNotifCount(Number(data.count || 0));
      }
    };
    if (open) {
      loadCount();
      timer = setInterval(loadCount, 30000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [open, token]);

  return (
    <div ref={ref} className="relative">
      <button
        className="px-3 py-2 rounded border hover:bg-black/5 flex items-center gap-2"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {user?.avatar ? (
          <img src={user.avatar} alt="avatar" className="w-6 h-6 rounded-full object-cover border" />
        ) : (
          <div className="w-6 h-6 rounded-full border bg-black/5" />
        )}
        <span>Admin</span>
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 rounded border bg-background shadow"
        >
          <div className="flex flex-col p-2">
            <Link href="/admin/dashboard" className="px-2 py-1 rounded hover:bg-black/5">
              Dashboard
            </Link>
            <Link href="/admin/users" className="px-2 py-1 rounded hover:bg-black/5">
              Users
            </Link>
            <Link href="/admin/tours" className="px-2 py-1 rounded hover:bg-black/5">
              Tours
            </Link>
            <Link href="/admin/bookings" className="px-2 py-1 rounded hover:bg-black/5">
              Bookings
            </Link>
            <Link href="/admin/reviews" className="px-2 py-1 rounded hover:bg-black/5">
              Reviews
            </Link>
            <Link href="/admin/payments" className="px-2 py-1 rounded hover:bg-black/5">
              Payments
            </Link>
            <Link href="/admin/support" className="px-2 py-1 rounded hover:bg-black/5">
              Support
            </Link>
            <div className="h-px bg-black/10 dark:bg-white/15 my-1" />
            <Link href="/admin/revenue" className="px-2 py-1 rounded hover:bg-black/5">
              Doanh thu
            </Link>
            <Link href="/admin/top-bookings" className="px-2 py-1 rounded hover:bg-black/5">
              Top đặt
            </Link>
            <Link href="/admin/top-revenue" className="px-2 py-1 rounded hover:bg-black/5">
              Top doanh thu
            </Link>
            <Link href="/admin/top-favorites" className="px-2 py-1 rounded hover:bg-black/5">
              Top yêu thích
            </Link>
            <Link href="/admin/analytics" className="px-2 py-1 rounded hover:bg-black/5">
              Analytics
            </Link>
            <Link href="/admin/notifications" className="px-2 py-1 rounded hover:bg-black/5">
              Notifications
            </Link>
            <div className="h-px bg-black/10 dark:bg-white/15 my-1" />
            <Link href="/user/profile" className="px-2 py-1 rounded hover:bg-black/5">
              Hồ sơ của tôi
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}