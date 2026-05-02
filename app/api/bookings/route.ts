import { NextRequest } from "next/server";
import type { BookingStatus, Prisma, TableType } from "@prisma/client";
import { BOOKING_STATUSES, TABLE_TYPES } from "@/lib/constants";
import { getSession, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ApiError, handleRouteError, ok } from "@/lib/http";
import { paginationFromSearchParams } from "@/lib/pagination";
import { assertRateLimit, clientIp } from "@/lib/rate-limit";
import { serializeBooking } from "@/lib/serializers";
import { bookingCreateSchema } from "@/lib/validation";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "all";
    const tableType = searchParams.get("tableType") || "all";
    const eventId = searchParams.get("eventId") || "all";
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const { limit, skip } = paginationFromSearchParams(searchParams, { limit: 50, max: 100 });
    const where: Prisma.BookingWhereInput = {};

    if (status !== "all" && BOOKING_STATUSES.includes(status as never)) {
      where.status = status as BookingStatus;
    }

    if (tableType !== "all" && TABLE_TYPES.includes(tableType as never)) {
      where.tableType = tableType as TableType;
    }

    if (eventId !== "all") {
      where.eventId = eventId;
    }

    if (from || to) {
      where.createdAt = {
        ...(from ? { gte: new Date(`${from}T00:00:00`) } : {}),
        ...(to ? { lte: new Date(`${to}T23:59:59`) } : {})
      };
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        event: true,
        user: { select: { id: true, email: true } }
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit
    });

    return ok(bookings.map(serializeBooking));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    assertRateLimit(`booking:${clientIp(request)}`, 5, 10 * 60 * 1000);
    const payload = bookingCreateSchema.parse(await request.json());
    const session = await getSession();

    const event = await prisma.event.findUnique({
      where: { id: payload.eventId }
    });

    if (!event || event.status !== "published") {
      throw new ApiError(404, "Sự kiện chưa mở nhận yêu cầu giữ bàn.");
    }

    const booking = await prisma.booking.create({
      data: {
        userId: session?.sub || null,
        eventId: payload.eventId,
        tableType: payload.tableType,
        guestCount: payload.guestCount,
        status: "PENDING",
        customerName: payload.customerName,
        customerPhone: payload.customerPhone,
        customerEmail: payload.customerEmail || session?.email || null,
        note: payload.note || null
      },
      include: { event: true, user: { select: { id: true, email: true } } }
    });

    return ok(serializeBooking(booking), 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
