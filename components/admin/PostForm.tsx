"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ThumbnailDropzone } from "@/components/admin/ThumbnailDropzone";

type InitialPost = {
  id?: string;
  title?: string;
  slug?: string;
  content?: string;
  thumbnail?: string | null;
  status?: string;
};

export function PostForm({ initialPost }: { initialPost?: InitialPost }) {
  const router = useRouter();
  const [content, setContent] = useState(initialPost?.content || "<p></p>");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(initialPost?.id);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setSaving(true);
    const form = new FormData(event.currentTarget);
    const payload = {
      title: form.get("title"),
      slug: form.get("slug"),
      thumbnail: form.get("thumbnail"),
      status: form.get("status"),
      content
    };

    try {
      const response = await fetch(isEdit ? `/api/posts/${initialPost?.id}` : "/api/posts", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!result.ok) {
        setMessage(result.error?.message || "Không lưu được bài viết.");
        return;
      }
      router.push("/admin/posts");
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
            <span className="text-xs font-black uppercase tracking-[.16em] text-slate-500">Tiêu đề bài viết</span>
            <input
              className="rounded-2xl border border-white/10 bg-slate-950/70 px-5 py-4 text-2xl font-black text-white outline-none transition placeholder:text-slate-600 focus:border-yellow-300/50 md:text-3xl"
              name="title"
              required
              defaultValue={initialPost?.title || ""}
              placeholder="Tiêu đề tin tức H Club"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-[.16em] text-slate-500">Slug</span>
            <input className="h-12 rounded-xl border border-white/10 bg-slate-950/70 px-3 text-sm font-bold text-slate-100 outline-none transition focus:border-yellow-300/50" name="slug" defaultValue={initialPost?.slug || ""} placeholder="Tự sinh nếu bỏ trống" />
          </label>

          <div className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-[.16em] text-slate-500">Nội dung</span>
            <RichTextEditor value={content} onChange={setContent} />
          </div>
        </div>
      </section>

      <aside className="grid h-max gap-4">
        <section className="rounded-2xl border border-white/10 bg-white/[.055] p-5 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
          <h2 className="text-sm font-black uppercase tracking-[.16em] text-yellow-200">Trạng thái</h2>
          <select className="mt-4 h-12 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 text-sm font-bold text-slate-100 outline-none transition focus:border-yellow-300/50" name="status" defaultValue={initialPost?.status || "draft"}>
            <option value="draft">Bản nháp</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[.055] p-5 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
          <h2 className="text-sm font-black uppercase tracking-[.16em] text-yellow-200">Ảnh đại diện</h2>
          <div className="mt-4">
            <ThumbnailDropzone value={initialPost?.thumbnail || ""} />
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[.055] p-5 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
          <button className="h-12 w-full rounded-xl bg-yellow-400 text-sm font-black text-slate-950 shadow-lg shadow-yellow-950/25 transition hover:bg-yellow-300 disabled:opacity-60" type="submit" disabled={saving}>
            {saving ? "Đang lưu..." : isEdit ? "Cập nhật bài viết" : "Tạo bài viết"}
          </button>
          <a className="mt-3 grid h-12 place-items-center rounded-xl border border-white/10 bg-white/[.05] text-sm font-bold text-slate-200 transition hover:bg-white/[.09]" href="/admin/posts">Hủy</a>
          {message ? <p className="mt-3 text-sm font-bold text-red-300">{message}</p> : null}
        </section>
      </aside>
    </form>
  );
}
