import { notFound } from "next/navigation";
import { PostForm } from "@/components/admin/PostForm";
import { prisma } from "@/lib/db";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function AdminPostEditPage({ params }: PageProps) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">Sửa bài viết</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{post.title}</p>
      </div>
      <PostForm initialPost={{
        id: post.id,
        title: post.title,
        slug: post.slug,
        content: post.content,
        thumbnail: post.thumbnail,
        status: post.status
      }} />
    </div>
  );
}
