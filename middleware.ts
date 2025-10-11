import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const securePaths = ["/admin", "/user"];
  const requiresAuth = securePaths.some((p) => req.nextUrl.pathname.startsWith(p));

  if (requiresAuth) {
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }
    // Verify token via backend
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const res = await fetch(`${base}/api/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const url = req.nextUrl.clone();
        url.pathname = "/auth/login";
        return NextResponse.redirect(url);
      }
      const data = await res.json();
      // If route requires admin, enforce role
      if (req.nextUrl.pathname.startsWith("/admin") && data?.user?.role !== "admin") {
        const url = req.nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
      }
    } catch {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};