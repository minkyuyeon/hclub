import { BookingActions } from "@/components/admin/BookingActions";
import { BOOKING_STATUS_LABELS, TABLE_TYPE_LABELS } from "@/lib/constants";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function StatusBadge({ status }: { status: keyof typeof BOOKING_STATUS_LABELS }) {
  const tone = {
    PENDING: "border-yellow-300/30 bg-yellow-400/15 text-yellow-200",
    CONFIRMED: "border-emerald-300/30 bg-emerald-400/15 text-emerald-200",
    CHECKED_IN: "border-emerald-300/30 bg-emerald-400/15 text-emerald-200",
    CANCELLED: "border-red-300/30 bg-red-500/15 text-red-200"
  }[status];

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${tone}`}>
      {BOOKING_STATUS_LABELS[status]}
    </span>
  );
}

export default async function AdminDashboardPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [activeEventCount, totalGuests, vipGuests, standingGuests, latestBookings] = await Promise.all([
    prisma.event.count({ where: { status: "published", date: { gte: today } } }),
    prisma.booking.aggregate({
      where: { status: { not: "CANCELLED" } },
      _sum: { guestCount: true }
    }),
    prisma.booking.aggregate({
      where: { tableType: "BAN_VIP", status: { not: "CANCELLED" } },
      _sum: { guestCount: true }
    }),
    prisma.booking.aggregate({
      where: { tableType: "BAN_DUNG", status: { not: "CANCELLED" } },
      _sum: { guestCount: true }
    }),
    prisma.booking.findMany({
      include: { event: true },
      orderBy: { createdAt: "desc" },
      take: 5
    })
  ]);

  const cards = [
    { label: "Sự kiện đang mở", value: activeEventCount, caption: "Published từ hôm nay" },
    { label: "Tổng khách đã đặt bàn", value: totalGuests._sum.guestCount || 0, caption: "Không tính booking đã hủy" },
    { label: "Tổng khách Bàn VIP", value: vipGuests._sum.guestCount || 0, caption: "Theo guest_count" },
    { label: "Tổng khách Bàn Đứng", value: standingGuests._sum.guestCount || 0, caption: "Theo guest_count" }
  ];

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">Dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Bảng điều khiển trung tâm cho mô hình đặt bàn trước của H Club.</p>
        </div>
        <a className="rounded-xl border border-yellow-400/30 bg-yellow-400 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-yellow-950/25 transition hover:bg-yellow-300" href="/admin/bookings">
          Xem tất cả booking
        </a>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article className="rounded-2xl border border-white/10 bg-white/[.055] p-5 shadow-2xl shadow-slate-950/30 backdrop-blur-xl" key={card.label}>
            <div className="flex items-start justify-between gap-3">
              <div className="text-sm font-bold text-slate-400">{card.label}</div>
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-300 shadow-[0_0_22px_rgba(234,179,8,.85)]" />
            </div>
            <div className="mt-5 text-4xl font-black tracking-tight text-yellow-300">{card.value}</div>
            <div className="mt-2 text-xs font-semibold text-slate-500">{card.caption}</div>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[.055] p-5 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-white">Booking mới nhất</h2>
            <p className="mt-1 text-sm text-slate-400">5 lượt đặt bàn gần nhất, có thể duyệt nhanh tại đây.</p>
          </div>
          <a className="rounded-xl border border-white/10 bg-white/[.05] px-4 py-2 text-sm font-bold text-slate-200 hover:bg-white/[.09]" href="/admin/bookings">Mở smart table</a>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[.14em] text-slate-500">
                <th className="border-b border-white/10 py-3 pr-4 font-black">Tên khách</th>
                <th className="border-b border-white/10 px-4 py-3 font-black">SĐT</th>
                <th className="border-b border-white/10 px-4 py-3 font-black">Loại bàn</th>
                <th className="border-b border-white/10 px-4 py-3 font-black">Trạng thái</th>
                <th className="border-b border-white/10 py-3 pl-4 font-black">Duyệt nhanh</th>
              </tr>
            </thead>
            <tbody>
              {latestBookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="border-b border-white/5 py-4 pr-4">
                    <div className="font-black text-white">{booking.customerName || "Khách"}</div>
                    <div className="mt-1 max-w-[260px] truncate text-xs text-slate-500">{booking.event.title}</div>
                  </td>
                  <td className="border-b border-white/5 px-4 py-4 text-slate-300">{booking.customerPhone || "Chưa có"}</td>
                  <td className="border-b border-white/5 px-4 py-4 font-bold text-slate-200">{TABLE_TYPE_LABELS[booking.tableType]}</td>
                  <td className="border-b border-white/5 px-4 py-4"><StatusBadge status={booking.status} /></td>
                  <td className="border-b border-white/5 py-4 pl-4"><BookingActions id={booking.id} status={booking.status} compact /></td>
                </tr>
              ))}
              {!latestBookings.length ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-400">Chưa có booking nào.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
