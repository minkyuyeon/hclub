import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ApiError, handleRouteError, ok } from "@/lib/http";
import { serializeBooking } from "@/lib/serializers";
import { bookingStatusSchema } from "@/lib/validation";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: Context) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    const payload = bookingStatusSchema.parse(await request.json());

    const current = await prisma.booking.findUnique({ where: { id } });
    if (!current) {
      throw new ApiError(404, "Không tìm thấy booking.");
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: { status: payload.status },
      include: { event: true, user: { select: { id: true, email: true } } }
    });

    return ok(serializeBooking(booking));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_request: NextRequest, context: Context) {
  try {
    await requireAdmin();
    const { id } = await context.params;

    const current = await prisma.booking.findUnique({ where: { id } });
    if (!current) {
      throw new ApiError(404, "Không tìm thấy booking.");
    }

    await prisma.booking.delete({ where: { id } });
    return ok({ deleted: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
