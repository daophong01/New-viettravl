"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/src/store/auth";
import AdminMenu from "@/src/components/AdminMenu";

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);

  const [favoritesCount, setFavoritesCount] = useState<number>(0);
  const token = useAuth((s) => s.token);

  useEffect(() => {
    const fetchFavs = async () => {
      if (!token) {
        setFavoritesCount(0);
        return;
      }
      try {
        const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
        const res = await fetch(`${base}/api/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const items = await res.json();
          setFavoritesCount(Array.isArray(items) ? items.length : 0);
        }
      } catch {
        setFavoritesCount(0);
      }
    };
    fetchFavs();
  }, [token]);

  const navLink = (href: string, label: string) => {
    const active = pathname === href;
    const isFavLink = href === "/user/favorites";
    return (
      <Link
        href={href}
        className={`px-3 py-2 rounded transition-colors ${
          active ? "bg-foreground text-background" : "hover:bg-black/5"
        } flex items-center gap-2`}
      >
        <span>{label}</span>
        {isFavLink && favoritesCount > 0 && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-foreground text-background">
            {favoritesCount}
          </span>
        )}
      </Link>
    );
  };

  return (
    <header className="w-full border-b border-black/10 dark:border-white/15 bg-background sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-tight">
          TravelGo
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          {navLink("/", "Home")}
          {navLink("/tours", "Tours")}
          {navLink("/about", "About")}
          {navLink("/contact", "Contact")}
          {user?.role === "admin" && <AdminMenu />}
          {user && navLink("/user/favorites", "Yêu thích")}
          {user && navLink("/user/security", "Bảo mật")}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover border"
                />
              ) : (
                <div className="w-8 h-8 rounded-full border bg-black/5" />
              )}
              <span className="text-sm">Xin chào, {user.name}</span>
              <Link
                href="/user/profile"
                className="px-3 py-2 rounded border border-black/10 dark:border-white/15 hover:bg-black/5"
              >
                Hồ sơ
              </Link>
              <Link
                href="/user/dashboard"
                className="px-3 py-2 rounded border border-black/10 dark:border-white/15 hover:bg-black/5"
              >
                Dashboard
              </Link>
              <Link
                href="/user/settings"
                className="px-3 py-2 rounded border border-black/10 dark:border-white/15 hover:bg-black/5"
              >
                Cài đặt
              </Link>
              <button
                onClick={() => {
                  logout();
                  // clear auth cookie token for middleware protection
                  document.cookie = "token=; Max-Age=0; path=/";
                }}
                className="px-3 py-2 rounded bg-foreground text-background hover:opacity-90"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="px-3 py-2 rounded border border-black/10 dark:border-white/15 hover:bg-black/5"
              >
                Đăng nhập
              </Link>
              <Link
                href="/auth/register"
                className="px-3 py-2 rounded bg-foreground text-background hover:opacity-90"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden border px-3 py-2 rounded"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          Menu
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden px-4 pb-3 space-y-2">
          <div className="flex flex-col gap-2">
            {navLink("/", "Home")}
            {navLink("/tours", "Tours")}
            {navLink("/about", "About")}
            {navLink("/contact", "Contact")}
            {user?.role === "admin" && (
              <>
                {navLink("/admin/dashboard", "Admin Dashboard")}
                {navLink("/admin/users", "Admin Users")}
                {navLink("/admin/tours", "Admin Tours")}
                {navLink("/admin/bookings", "Admin Bookings")}
                {navLink("/admin/reviews", "Admin Reviews")}
                {navLink("/admin/payments", "Admin Payments")}
              </>
            )}
          </div>
          <div className="flex flex-col gap-2 mt-2">
            {user ? (
              <>
                <div className="flex items-center gap-3">
                  {user.avatar ? (
                    <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover border" />
                  ) : (
                    <div className="w-8 h-8 rounded-full border bg-black/5" />
                  )}
                  <span className="text-sm">Xin chào, {user.name}</span>
                </div>
                <Link
                  href="/user/profile"
                  className="px-3 py-2 rounded border border-black/10 dark:border-white/15 hover:bg-black/5 w-full text-center"
                >
                  Hồ sơ
                </Link>
                <Link
                  href="/user/favorites"
                  className="px-3 py-2 rounded border border-black/10 dark:border-white/15 hover:bg-black/5 w-full text-center"
                >
                  Yêu thích
                </Link>
                <Link
                  href="/user/dashboard"
                  className="px-3 py-2 rounded border border-black/10 dark:border-white/15 hover:bg-black/5 w-full text-center"
                >
                  Dashboard
                </Link>
                <Link
                  href="/user/settings"
                  className="px-3 py-2 rounded border border-black/10 dark:border-white/15 hover:bg-black/5 w-full text-center"
                >
                  Cài đặt
                </Link>
                <button
                  onClick={() => logout()}
                  className="px-3 py-2 rounded bg-foreground text-background hover:opacity-90 w-full text-center"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-3 py-2 rounded border border-black/10 dark:border-white/15 hover:bg-black/5 w-full text-center"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/auth/register"
                  className="px-3 py-2 rounded bg-foreground text-background hover:opacity-90 w-full text-center"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}