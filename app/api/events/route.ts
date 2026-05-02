import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { handleRouteError, ok } from "@/lib/http";
import { paginationFromSearchParams } from "@/lib/pagination";
import { serializeEvent } from "@/lib/serializers";
import { buildSlug } from "@/lib/slug";
import { eventSchema } from "@/lib/validation";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { limit, skip } = paginationFromSearchParams(searchParams);
    const status = searchParams.get("status") || "published";
    const upcoming = searchParams.get("upcoming") !== "false";

    if (status === "all") {
      await requireAdmin();
    }

    const events = await prisma.event.findMany({
      where: {
        ...(status === "all" ? {} : { status }),
        ...(upcoming ? { date: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } } : {})
      },
      orderBy: { date: "asc" },
      skip,
      take: limit
    });

    return ok(events.map(serializeEvent));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const payload = eventSchema.parse(await request.json());
    const totalTickets = payload.totalTickets;
    const availableTickets = payload.availableTickets ?? totalTickets;
    const event = await prisma.event.create({
      data: {
        title: payload.title,
        slug: payload.slug ? buildSlug(payload.slug) : buildSlug(payload.title),
        description: payload.description,
        date: payload.date,
        location: payload.location,
        ticketPrice: payload.ticketPrice,
        totalTickets,
        availableTickets: Math.min(availableTickets, totalTickets),
        status: payload.status,
        thumbnail: payload.thumbnail || null
      }
    });

    return ok(serializeEvent(event), 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
