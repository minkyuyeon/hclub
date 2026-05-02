import { DeleteButton } from "@/components/admin/DeleteButton";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
const PAGE_SIZE = 60;

const statusLabel: Record<string, string> = {
  published: "Đang mở bán",
  sold_out: "Hết bàn",
  cancelled: "Đóng",
  draft: "Bản nháp"
};

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({ orderBy: { date: "asc" }, take: PAGE_SIZE });

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">Quản lý sự kiện</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Grid media cho toàn bộ live show, trạng thái nhận bàn và thao tác chỉnh sửa nhanh.</p>
        </div>
        <a className="rounded-xl bg-yellow-400 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-yellow-950/25 transition hover:bg-yellow-300" href="/admin/events/create">
          Tạo sự kiện mới
        </a>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {events.map((event) => (
          <article className="overflow-hidden rounded-2xl border border-white/10 bg-white/[.055] shadow-2xl shadow-slate-950/30 backdrop-blur-xl" key={event.id}>
            <div className="relative aspect-[3/4] bg-slate-950">
              <img className="h-full w-full object-cover" src={event.thumbnail || "/images/hero-space.jpg"} alt={event.title} loading="lazy" decoding="async" />
              <div className="absolute left-4 top-4 rounded-xl border border-slate-950/20 bg-slate-950/70 px-3 py-2 text-xs font-black text-yellow-200 backdrop-blur">
                {event.date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })}
              </div>
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/10 bg-slate-950/70 p-4 backdrop-blur">
                <h2 className="line-clamp-2 text-xl font-black text-white">{event.title}</h2>
                <p className="mt-1 text-xs font-semibold text-slate-400">{event.location}</p>
              </div>
            </div>
            <div className="grid gap-4 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full border border-yellow-300/30 bg-yellow-400/15 px-3 py-1 text-xs font-black text-yellow-200">
                  {statusLabel[event.status] || event.status}
                </span>
                <span className="text-xs font-bold text-slate-500">{event.date.toLocaleString("vi-VN")}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <a className="rounded-xl border border-white/10 bg-white/[.05] px-4 py-2 text-xs font-black text-slate-200 transition hover:bg-white/[.09]" href={`/admin/events/${event.id}`}>Sửa</a>
                <DeleteButton endpoint={`/api/events/${event.id}`} />
              </div>
            </div>
          </article>
        ))}
        {!events.length ? (
          <div className="rounded-2xl border border-white/10 bg-white/[.055] p-8 text-center text-slate-400 md:col-span-2 xl:col-span-3">
            Chưa có sự kiện nào.
          </div>
        ) : null}
      </section>
    </div>
  );
}
