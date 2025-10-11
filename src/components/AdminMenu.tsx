"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

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

  return (
    <div ref={ref} className="relative">
      <button
        className="px-3 py-2 rounded border hover:bg-black/5"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        Admin
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
          </div>
        </div>
      )}
    </div>
  );
}