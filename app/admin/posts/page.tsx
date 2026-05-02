import { DeleteButton } from "@/components/admin/DeleteButton";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
const PAGE_SIZE = 60;

function strip(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 130);
}

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    include: { author: { select: { email: true } } },
    orderBy: { createdAt: "desc" },
    take: PAGE_SIZE
  });

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">Quản lý bài viết</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">CMS bài viết dạng media grid, hỗ trợ rich text, upload ảnh/video và iframe embed.</p>
        </div>
        <a className="rounded-xl bg-yellow-400 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-yellow-950/25 transition hover:bg-yellow-300" href="/admin/posts/create">
          Tạo bài viết mới
        </a>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <article className="overflow-hidden rounded-2xl border border-white/10 bg-white/[.055] shadow-2xl shadow-slate-950/30 backdrop-blur-xl" key={post.id}>
            <div className="aspect-[16/10] bg-slate-950">
              <img className="h-full w-full object-cover" src={post.thumbnail || "/images/hero-space.jpg"} alt={post.title} loading="lazy" decoding="async" />
            </div>
            <div className="grid gap-4 p-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-yellow-300/30 bg-yellow-400/15 px-3 py-1 text-xs font-black text-yellow-200">{post.status}</span>
                  <span className="text-xs font-bold text-slate-500">{post.createdAt.toLocaleDateString("vi-VN")}</span>
                </div>
                <h2 className="mt-3 line-clamp-2 text-xl font-black text-white">{post.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-400">{strip(post.content)}</p>
                <p className="mt-2 text-xs text-slate-500">Tác giả: {post.author.email}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <a className="rounded-xl border border-white/10 bg-white/[.05] px-4 py-2 text-xs font-black text-slate-200 transition hover:bg-white/[.09]" href={`/admin/posts/${post.id}`}>Sửa</a>
                <DeleteButton endpoint={`/api/posts/${post.id}`} />
              </div>
            </div>
          </article>
        ))}
        {!posts.length ? (
          <div className="rounded-2xl border border-white/10 bg-white/[.055] p-8 text-center text-slate-400 md:col-span-2 xl:col-span-3">
            Chưa có bài viết nào.
          </div>
        ) : null}
      </section>
    </div>
  );
}
