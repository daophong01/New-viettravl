import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const isAdminPath = req.nextUrl.pathname.startsWith("/admin");
  const isUserPath = req.nextUrl.pathname.startsWith("/user");

  if ((isAdminPath || isUserPath) && !token) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  const res = NextResponse.next();

  if (isAdminPath) {
    // Verify only for admin paths to reduce calls
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const verify = await fetch(`${base}/api/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!verify.ok) {
        const url = req.nextUrl.clone();
        url.pathname = "/auth/login";
        return NextResponse.redirect(url);
      }
      const data = await verify.json();
      if (data?.user?.role !== "admin") {
        const url = req.nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
      }
    } catch {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }
    // add noindex headers for admin pages
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};