import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ApiError, handleRouteError, ok } from "@/lib/http";
import { serializePost } from "@/lib/serializers";
import { buildSlug } from "@/lib/slug";
import { postSchema } from "@/lib/validation";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: Context) {
  try {
    const { id } = await context.params;
    const post = await prisma.post.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: { author: { select: { id: true, email: true } } }
    });

    if (!post) {
      throw new ApiError(404, "Không tìm thấy bài viết.");
    }

    if (post.status !== "published") {
      await requireAdmin();
    }

    return ok(serializePost(post));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PUT(request: NextRequest, context: Context) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    const payload = postSchema.partial().parse(await request.json());
    const post = await prisma.post.update({
      where: { id },
      data: {
        ...(payload.title ? { title: payload.title } : {}),
        ...(payload.slug ? { slug: buildSlug(payload.slug) } : {}),
        ...(payload.content ? { content: payload.content } : {}),
        ...(payload.thumbnail !== undefined ? { thumbnail: payload.thumbnail || null } : {}),
        ...(payload.status ? { status: payload.status } : {})
      },
      include: { author: { select: { id: true, email: true } } }
    });

    return ok(serializePost(post));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_request: NextRequest, context: Context) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    await prisma.post.delete({ where: { id } });
    return ok({ deleted: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
