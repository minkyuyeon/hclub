import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ApiError, handleRouteError, ok } from "@/lib/http";
import { paginationFromSearchParams } from "@/lib/pagination";
import { serializePost } from "@/lib/serializers";
import { buildSlug } from "@/lib/slug";
import { postSchema } from "@/lib/validation";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { limit, skip } = paginationFromSearchParams(searchParams);
    const status = searchParams.get("status") || "published";

    if (status === "all") {
      await requireAdmin();
    }

    const posts = await prisma.post.findMany({
      where: status === "all" ? undefined : { status },
      include: { author: { select: { id: true, email: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit
    });

    return ok(posts.map(serializePost));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    const payload = postSchema.parse(await request.json());
    const post = await prisma.post.create({
      data: {
        title: payload.title,
        slug: payload.slug ? buildSlug(payload.slug) : buildSlug(payload.title),
        content: payload.content,
        thumbnail: payload.thumbnail || null,
        status: payload.status,
        authorId: admin.id
      },
      include: { author: { select: { id: true, email: true } } }
    });

    return ok(serializePost(post), 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
