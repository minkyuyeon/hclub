"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button className="w-full rounded-xl border border-white/10 bg-white/[.04] px-3 py-2.5 text-sm font-black text-slate-200 transition hover:border-red-300/30 hover:bg-red-500/15 hover:text-red-100" type="button" onClick={logout}>
      Đăng xuất
    </button>
  );
}
