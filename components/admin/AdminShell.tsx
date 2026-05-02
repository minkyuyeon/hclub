import { AdminNav } from "@/components/admin/AdminNav";
import { LogoutButton } from "@/components/admin/LogoutButton";

export function AdminShell({ children, email }: { children: React.ReactNode; email: string }) {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(234,179,8,.16),transparent_28%),radial-gradient(circle_at_84%_18%,rgba(59,130,246,.09),transparent_28%),linear-gradient(180deg,#111827_0%,#0f172a_45%,#070b12_100%)]" />

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[280px] border-r border-white/10 bg-slate-950/70 px-4 py-5 shadow-2xl backdrop-blur-xl lg:block">
        <div className="mb-8 flex items-center gap-3 rounded-2xl border border-yellow-400/15 bg-white/[.035] p-3">
          <img className="h-14 w-14 object-contain drop-shadow-[0_12px_32px_rgba(234,179,8,.25)]" src="/images/logo-h-club-official.png" alt="H Club" loading="eager" decoding="async" />
          <div>
            <div className="text-sm font-black uppercase tracking-[.18em] text-yellow-200">hclub.vn</div>
            <div className="mt-1 text-xs font-semibold text-slate-400">Admin CMS 2.0</div>
          </div>
        </div>

        <AdminNav />

        <div className="absolute bottom-5 left-4 right-4 rounded-2xl border border-white/10 bg-white/[.035] p-4">
          <div className="text-xs font-bold uppercase tracking-[.16em] text-slate-500">Đăng nhập</div>
          <div className="mt-1 truncate text-sm font-bold text-slate-200">{email}</div>
          <div className="mt-4">
            <LogoutButton />
          </div>
        </div>
      </aside>

      <div className="relative z-10 lg:pl-[280px]">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0f172a]/80 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs font-black uppercase tracking-[.22em] text-yellow-300">Nightlife Reservation CMS</div>
              <div className="mt-1 text-sm text-slate-400">Quản trị sự kiện, bài viết và yêu cầu giữ bàn H Club.</div>
            </div>
            <div className="flex items-center gap-3">
              <a className="rounded-xl border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-sm font-black text-yellow-200 shadow-lg shadow-yellow-950/20 transition hover:bg-yellow-400/20" href="/admin/events/create">
                Tạo sự kiện
              </a>
              <a className="rounded-xl border border-white/10 bg-white/[.04] px-4 py-2 text-sm font-bold text-slate-200 transition hover:bg-white/[.08]" href="/">
                Xem website
              </a>
            </div>
          </div>

          <div className="mt-4 lg:hidden">
            <AdminNav />
          </div>
        </header>

        <main className="min-h-[calc(100vh-86px)] px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
