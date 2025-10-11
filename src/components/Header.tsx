"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLink = (href: string, label: string) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`px-3 py-2 rounded transition-colors ${
          active ? "bg-foreground text-background" : "hover:bg-black/5"
        }`}
      >
        {label}
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
        </nav>

        <div className="hidden md:flex items-center gap-2">
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
          </div>
          <div className="flex gap-2 mt-2">
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
          </div>
        </div>
      )}
    </header>
  );
}