import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const now = new Date();
  const [events, posts] = await Promise.all([
    prisma.event.findMany({
      where: { status: "published", date: { gte: now } },
      select: { slug: true, updatedAt: true },
      orderBy: { date: "asc" },
      take: 200
    }),
    prisma.post.findMany({
      where: { status: "published" },
      select: { slug: true, updatedAt: true },
      orderBy: { createdAt: "desc" },
      take: 200
    })
  ]);

  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1
    },
    ...events.map((event) => ({
      url: `${siteUrl}/events/${event.slug}`,
      lastModified: event.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.9
    })),
    ...posts.map((post) => ({
      url: `${siteUrl}/posts/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7
    }))
  ];
}
