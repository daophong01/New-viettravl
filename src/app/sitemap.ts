import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";
  const lastMod = new Date().toISOString();
  return [
    { url: `${base}/`, lastModified: lastMod, changeFrequency: "daily", priority: 1 },
    { url: `${base}/tours`, lastModified: lastMod, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/about`, lastModified: lastMod, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/contact`, lastModified: lastMod, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/admin/dashboard`, lastModified: lastMod, changeFrequency: "weekly", priority: 0.3 },
    { url: `${base}/admin/users`, lastModified: lastMod, changeFrequency: "weekly", priority: 0.3 },
    { url: `${base}/admin/tours`, lastModified: lastMod, changeFrequency: "weekly", priority: 0.3 },
    { url: `${base}/admin/bookings`, lastModified: lastMod, changeFrequency: "weekly", priority: 0.3 },
    { url: `${base}/admin/reviews`, lastModified: lastMod, changeFrequency: "weekly", priority: 0.3 },
  ];
}