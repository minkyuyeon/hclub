import type { BookingStatus, Prisma, TableType } from "@prisma/client";
import { BookingActions } from "@/components/admin/BookingActions";
import { BOOKING_STATUS_LABELS, TABLE_TYPE_LABELS, TABLE_TYPES } from "@/lib/constants";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function formatDate(value: Date) {
  return value.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function StatusBadge({ status }: { status: BookingStatus }) {
  const tone = {
    PENDING: "border-yellow-300/30 bg-yellow-400/15 text-yellow-200",
    CONFIRMED: "border-emerald-300/30 bg-emerald-400/15 text-emerald-200",
    CHECKED_IN: "border-emerald-300/30 bg-emerald-400/15 text-emerald-200",
    CANCELLED: "border-red-300/30 bg-red-500/15 text-red-200"
  }[status];

  return (
    <span className={`inline-flex whitespace-nowrap rounded-full border px-3 py-1 text-xs font-black ${tone}`}>
      {BOOKING_STATUS_LABELS[status]}
    </span>
  );
}

export default async function AdminBookingsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const from = firstParam(params?.from) || "";
  const to = firstParam(params?.to) || "";
  const tableType = firstParam(params?.tableType) || "all";
  const eventId = firstParam(params?.eventId) || "all";
  const where: Prisma.BookingWhereInput = {};

  if (tableType !== "all" && TABLE_TYPES.includes(tableType as TableType)) {
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

  const [bookings, events] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: {
        event: true,
        user: { select: { email: true } }
      },
      orderBy: { createdAt: "desc" },
      take: 200
    }),
    prisma.event.findMany({
      select: { id: true, title: true, date: true },
      orderBy: { date: "desc" },
      take: 200
    })
  ]);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">Quản lý Booking</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Smart table cho toàn bộ yêu cầu giữ bàn, lọc nhanh theo sự kiện, loại bàn và khoảng ngày đặt.</p>
        </div>
        <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/10 px-5 py-3 text-sm font-bold text-yellow-100">
          {bookings.length} booking đang hiển thị
        </div>
      </div>

      <form className="rounded-2xl border border-white/10 bg-white/[.055] p-4 shadow-2xl shadow-slate-950/30 backdrop-blur-xl" action="/admin/bookings">
        <div className="grid gap-4 xl:grid-cols-[1.3fr_.9fr_.8fr_.8fr_auto]">
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-[.16em] text-slate-500">Sự kiện</span>
            <select className="h-12 rounded-xl border border-white/10 bg-slate-950/70 px-3 text-sm font-bold text-slate-100 outline-none transition focus:border-yellow-300/50" name="eventId" defaultValue={eventId}>
              <option value="all">Tất cả sự kiện</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-[.16em] text-slate-500">Loại bàn</span>
            <select className="h-12 rounded-xl border border-white/10 bg-slate-950/70 px-3 text-sm font-bold text-slate-100 outline-none transition focus:border-yellow-300/50" name="tableType" defaultValue={tableType}>
              <option value="all">Tất cả</option>
              {TABLE_TYPES.map((type) => (
                <option key={type} value={type}>{TABLE_TYPE_LABELS[type]}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-[.16em] text-slate-500">Từ ngày</span>
            <input className="h-12 rounded-xl border border-white/10 bg-slate-950/70 px-3 text-sm font-bold text-slate-100 outline-none transition focus:border-yellow-300/50" name="from" type="date" defaultValue={from} />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-[.16em] text-slate-500">Đến ngày</span>
            <input className="h-12 rounded-xl border border-white/10 bg-slate-950/70 px-3 text-sm font-bold text-slate-100 outline-none transition focus:border-yellow-300/50" name="to" type="date" defaultValue={to} />
          </label>
          <div className="flex items-end gap-2">
            <button className="h-12 rounded-xl bg-yellow-400 px-5 text-sm font-black text-slate-950 shadow-lg shadow-yellow-950/25 transition hover:bg-yellow-300" type="submit">Lọc</button>
            <a className="grid h-12 place-items-center rounded-xl border border-white/10 bg-white/[.05] px-4 text-sm font-bold text-slate-200 transition hover:bg-white/[.09]" href="/admin/bookings">Xóa</a>
          </div>
        </div>
      </form>

      <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[.055] shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="min-w-[1180px] w-full border-separate border-spacing-0 text-sm">
            <thead>
              <tr className="bg-slate-950/50 text-left text-xs uppercase tracking-[.14em] text-slate-500">
                <th className="px-5 py-4 font-black">Tên khách</th>
                <th className="px-5 py-4 font-black">SĐT</th>
                <th className="px-5 py-4 font-black">Sự kiện</th>
                <th className="px-5 py-4 font-black">Ngày đặt</th>
                <th className="px-5 py-4 font-black">Số lượng</th>
                <th className="px-5 py-4 font-black">Loại bàn</th>
                <th className="px-5 py-4 font-black">Trạng thái</th>
                <th className="px-5 py-4 font-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr className="group transition hover:bg-white/[.035]" key={booking.id}>
                  <td className="border-t border-white/5 px-5 py-4">
                    <div className="font-black text-white">{booking.customerName || booking.user?.email || "Khách"}</div>
                    <div className="mt-1 max-w-[220px] truncate text-xs text-slate-500">{booking.customerEmail || booking.user?.email || "Không có email"}</div>
                  </td>
                  <td className="border-t border-white/5 px-5 py-4 font-bold text-slate-300">{booking.customerPhone || "Chưa có"}</td>
                  <td className="border-t border-white/5 px-5 py-4">
                    <div className="max-w-[300px] truncate font-black text-slate-100">{booking.event.title}</div>
                    <div className="mt-1 text-xs text-slate-500">Diễn ra: {booking.event.date.toLocaleString("vi-VN")}</div>
                  </td>
                  <td className="border-t border-white/5 px-5 py-4 text-slate-300">{formatDate(booking.createdAt)}</td>
                  <td className="border-t border-white/5 px-5 py-4">
                    <span className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 font-black text-yellow-200">{booking.guestCount}</span>
                  </td>
                  <td className="border-t border-white/5 px-5 py-4 font-bold text-slate-200">{TABLE_TYPE_LABELS[booking.tableType]}</td>
                  <td className="border-t border-white/5 px-5 py-4"><StatusBadge status={booking.status} /></td>
                  <td className="border-t border-white/5 px-5 py-4"><BookingActions id={booking.id} status={booking.status} /></td>
                </tr>
              ))}
              {!bookings.length ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">Không có booking phù hợp bộ lọc.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
