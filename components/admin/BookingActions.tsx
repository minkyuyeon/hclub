"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { BookingStatus } from "@prisma/client";

export function BookingActions({ id, status, compact = false }: { id: string; status: BookingStatus; compact?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function update(statusValue: BookingStatus) {
    setLoading(true);
    try {
      await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: statusValue })
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  const baseButton = compact
    ? "rounded-lg px-3 py-2 text-xs font-black disabled:opacity-40"
    : "rounded-xl px-3 py-2.5 text-xs font-black disabled:opacity-40";

  if (compact) {
    return (
      <div className="flex min-w-28 flex-wrap gap-2">
        <button
          className={`${baseButton} bg-emerald-500 text-slate-950`}
          disabled={loading || status === "CONFIRMED" || status === "CHECKED_IN" || status === "CANCELLED"}
          onClick={() => update("CONFIRMED")}
          type="button"
        >
          Duyệt
        </button>
        <button
          className={`${baseButton} bg-sky-500 text-slate-950`}
          disabled={loading || status !== "CONFIRMED"}
          onClick={() => update("CHECKED_IN")}
          type="button"
        >
          Check-in
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-w-56 flex-wrap gap-2">
      <button
        className={`${baseButton} bg-yellow-400 text-slate-950`}
        disabled={loading || status === "PENDING"}
        onClick={() => update("PENDING")}
        type="button"
      >
        Pending
      </button>
      <button
        className={`${baseButton} bg-emerald-500 text-slate-950`}
        disabled={loading || status === "CONFIRMED"}
        onClick={() => update("CONFIRMED")}
        type="button"
      >
        Xác nhận
      </button>
      <button
        className={`${baseButton} bg-sky-500 text-slate-950`}
        disabled={loading || status === "CHECKED_IN"}
        onClick={() => update("CHECKED_IN")}
        type="button"
      >
        Check-in
      </button>
      <button
        className={`${baseButton} bg-red-500 text-white`}
        disabled={loading || status === "CANCELLED"}
        onClick={() => update("CANCELLED")}
        type="button"
      >
        Hủy
      </button>
    </div>
  );
}
