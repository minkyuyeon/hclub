"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ThumbnailDropzone } from "@/components/admin/ThumbnailDropzone";

type InitialEvent = {
  id?: string;
  title?: string;
  slug?: string;
  description?: string;
  date?: string;
  location?: string;
  totalTickets?: number;
  status?: string;
  thumbnail?: string | null;
};

function toDatetimeLocal(value?: string) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 16);
}

export function EventForm({ initialEvent }: { initialEvent?: InitialEvent }) {
  const router = useRouter();
  const [description, setDescription] = useState(initialEvent?.description || "<p></p>");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(initialEvent?.id);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setSaving(true);
    const form = new FormData(event.currentTarget);
    const payload = {
      title: form.get("title"),
      slug: form.get("slug"),
      description,
      date: form.get("date"),
      location: form.get("location"),
      status: form.get("status"),
      thumbnail: form.get("thumbnail")
    };

    try {
      const response = await fetch(isEdit ? `/api/events/${initialEvent?.id}` : "/api/events", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!result.ok) {
        setMessage(result.error?.message || "Không lưu được sự kiện.");
        return;
      }
      router.push("/admin/events");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]" onSubmit={submit}>
      <section className="rounded-2xl border border-white/10 bg-white/[.055] p-5 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
        <div className="grid gap-5">
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-[.16em] text-slate-500">Tiêu đề sự kiện</span>
            <input
              className="rounded-2xl border border-white/10 bg-slate-950/70 px-5 py-4 text-2xl font-black text-white outline-none transition placeholder:text-slate-600 focus:border-yellow-300/50 md:text-3xl"
              name="title"
              required
              defaultValue={initialEvent?.title || ""}
              placeholder="H Club Live Show | May 2026"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-[.16em] text-slate-500">Slug</span>
            <input
              className="h-12 rounded-xl border border-white/10 bg-slate-950/70 px-3 text-sm font-bold text-slate-100 outline-none transition focus:border-yellow-300/50"
              name="slug"
              defaultValue={initialEvent?.slug || ""}
              placeholder="Tự sinh nếu bỏ trống"
            />
          </label>

          <div className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-[.16em] text-slate-500">Mô tả sự kiện</span>
            <RichTextEditor value={description} onChange={setDescription} />
          </div>
        </div>
      </section>

      <aside className="grid h-max gap-4">
        <section className="rounded-2xl border border-white/10 bg-white/[.055] p-5 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
          <h2 className="text-sm font-black uppercase tracking-[.16em] text-yellow-200">Trạng thái</h2>
          <select className="mt-4 h-12 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 text-sm font-bold text-slate-100 outline-none transition focus:border-yellow-300/50" name="status" defaultValue={initialEvent?.status || "draft"}>
            <option value="published">Đang mở bán</option>
            <option value="sold_out">Hết bàn</option>
            <option value="cancelled">Đóng</option>
            <option value="draft">Bản nháp</option>
          </select>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[.055] p-5 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
          <h2 className="text-sm font-black uppercase tracking-[.16em] text-yellow-200">Thời gian tổ chức</h2>
          <div className="mt-4 grid gap-4">
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[.16em] text-slate-500">Ngày giờ</span>
              <input className="h-12 rounded-xl border border-white/10 bg-slate-950/70 px-3 text-sm font-bold text-slate-100 outline-none transition focus:border-yellow-300/50" name="date" type="datetime-local" required defaultValue={toDatetimeLocal(initialEvent?.date)} />
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[.16em] text-slate-500">Địa điểm</span>
              <input className="h-12 rounded-xl border border-white/10 bg-slate-950/70 px-3 text-sm font-bold text-slate-100 outline-none transition focus:border-yellow-300/50" name="location" required defaultValue={initialEvent?.location || "H Club, Bãi Cháy, Hạ Long"} />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[.055] p-5 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
          <h2 className="text-sm font-black uppercase tracking-[.16em] text-yellow-200">Ảnh đại diện</h2>
          <div className="mt-4">
            <ThumbnailDropzone value={initialEvent?.thumbnail || ""} />
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[.055] p-5 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
          <button className="h-12 w-full rounded-xl bg-yellow-400 text-sm font-black text-slate-950 shadow-lg shadow-yellow-950/25 transition hover:bg-yellow-300 disabled:opacity-60" type="submit" disabled={saving}>
            {saving ? "Đang lưu..." : isEdit ? "Cập nhật sự kiện" : "Tạo sự kiện"}
          </button>
          <a className="mt-3 grid h-12 place-items-center rounded-xl border border-white/10 bg-white/[.05] text-sm font-bold text-slate-200 transition hover:bg-white/[.09]" href="/admin/events">Hủy</a>
          {message ? <p className="mt-3 text-sm font-bold text-red-300">{message}</p> : null}
        </section>
      </aside>
    </form>
  );
}
