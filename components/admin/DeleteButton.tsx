"use client";

import { useRouter } from "next/navigation";

export function DeleteButton({ endpoint, label = "Xóa" }: { endpoint: string; label?: string }) {
  const router = useRouter();

  async function remove() {
    if (!window.confirm("Xác nhận xóa?")) return;
    await fetch(endpoint, { method: "DELETE" });
    router.refresh();
  }

  return (
    <button className="rounded-xl border border-red-300/20 bg-red-500/15 px-4 py-2 text-xs font-black text-red-100 transition hover:bg-red-500/25" type="button" onClick={remove}>
      {label}
    </button>
  );
}
