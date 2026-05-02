import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ApiError, handleRouteError, ok } from "@/lib/http";
import { serializeEvent } from "@/lib/serializers";
import { buildSlug } from "@/lib/slug";
import { eventSchema } from "@/lib/validation";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: Context) {
  try {
    const { id } = await context.params;
    const event = await prisma.event.findFirst({
      where: { OR: [{ id }, { slug: id }] }
    });

    if (!event) {
      throw new ApiError(404, "Không tìm thấy sự kiện.");
    }

    if (event.status !== "published") {
      await requireAdmin();
    }

    return ok(serializeEvent(event));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PUT(request: NextRequest, context: Context) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    const payload = eventSchema.partial().parse(await request.json());
    const current = await prisma.event.findUnique({ where: { id } });
    if (!current) {
      throw new ApiError(404, "Không tìm thấy sự kiện.");
    }

    const totalTickets = payload.totalTickets ?? current.totalTickets;
    const availableTickets = payload.availableTickets ?? current.availableTickets;
    const event = await prisma.event.update({
      where: { id },
      data: {
        ...(payload.title ? { title: payload.title } : {}),
        ...(payload.slug ? { slug: buildSlug(payload.slug) } : {}),
        ...(payload.description ? { description: payload.description } : {}),
        ...(payload.date ? { date: payload.date } : {}),
        ...(payload.location ? { location: payload.location } : {}),
        ...(payload.ticketPrice !== undefined ? { ticketPrice: payload.ticketPrice } : {}),
        totalTickets,
        availableTickets: Math.min(availableTickets, totalTickets),
        ...(payload.status ? { status: payload.status } : {}),
        ...(payload.thumbnail !== undefined ? { thumbnail: payload.thumbnail || null } : {})
      }
    });

    return ok(serializeEvent(event));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_request: NextRequest, context: Context) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    await prisma.event.delete({ where: { id } });
    return ok({ deleted: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
