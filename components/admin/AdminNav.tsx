"use client";

import { usePathname } from "next/navigation";

const nav = [
  { href: "/admin", label: "Dashboard", marker: "D" },
  { href: "/admin/bookings", label: "Booking", marker: "B" },
  { href: "/admin/events", label: "Sự kiện", marker: "E" },
  { href: "/admin/posts", label: "Bài viết", marker: "P" },
  { href: "/", label: "Xem website", marker: "W" }
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="grid gap-2">
      {nav.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <a
            className={[
              "group flex items-center gap-3 rounded-xl border px-3.5 py-3 text-sm font-extrabold transition",
              active
                ? "border-yellow-400/40 bg-yellow-400/15 text-yellow-200 shadow-[0_18px_45px_rgba(234,179,8,.12)]"
                : "border-white/5 bg-white/[.025] text-slate-300 hover:border-white/15 hover:bg-white/[.06] hover:text-white"
            ].join(" ")}
            href={item.href}
            key={item.href}
          >
            <span className={[
              "grid h-8 w-8 place-items-center rounded-lg border text-xs",
              active ? "border-yellow-300/30 bg-yellow-400/20 text-yellow-200" : "border-white/10 bg-slate-950/60 text-slate-400 group-hover:text-yellow-200"
            ].join(" ")}>
              {item.marker}
            </span>
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
