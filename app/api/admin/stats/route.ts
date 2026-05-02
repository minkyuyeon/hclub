import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { handleRouteError, ok } from "@/lib/http";

export async function GET() {
  try {
    await requireAdmin();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [activeEventCount, postCount, bookingCount, vipGuests, standingGuests] = await Promise.all([
      prisma.event.count({ where: { status: "published", date: { gte: today } } }),
      prisma.post.count(),
      prisma.booking.count(),
      prisma.booking.aggregate({
        where: { tableType: "BAN_VIP", status: { not: "CANCELLED" } },
        _sum: { guestCount: true }
      }),
      prisma.booking.aggregate({
        where: { tableType: "BAN_DUNG", status: { not: "CANCELLED" } },
        _sum: { guestCount: true }
      })
    ]);

    return ok({
      activeEventCount,
      postCount,
      bookingCount,
      vipGuests: vipGuests._sum.guestCount || 0,
      standingGuests: standingGuests._sum.guestCount || 0
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
