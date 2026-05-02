import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { prisma } from "@/lib/db";
import { plainTextFromHtml, sanitizeRichText } from "@/lib/sanitize";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findFirst({
    where: { OR: [{ slug }, { id: slug }], status: "published" }
  });

  if (!post) {
    return {};
  }

  const description = plainTextFromHtml(post.content, 180) || `${post.title} - H Club Hạ Long.`;
  const image = post.thumbnail || "/images/hero-space.jpg";

  return {
    title: `${post.title} | H Club`,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url: `/posts/${post.slug}`,
      images: [{ url: image, width: 1200, height: 630, alt: post.title }]
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [image]
    }
  };
}

export default async function PostDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await prisma.post.findFirst({
    where: { OR: [{ slug }, { id: slug }], status: "published" },
    include: { author: { select: { email: true } } }
  });

  if (!post) {
    notFound();
  }

  const safeContent = sanitizeRichText(post.content);

  return (
    <div className="site-shell">
      <Header />
      <main className="section max-w-4xl">
        <a className="btn btn-ghost mb-8" href="/#news">← Quay lại tin mới</a>
        {post.thumbnail ? <img className="mb-7 aspect-[16/9] w-full rounded-lg border border-[color:var(--line)] object-cover" src={post.thumbnail} alt={post.title} loading="eager" decoding="async" /> : null}
        <div className="section-kicker">{post.createdAt.toLocaleDateString("vi-VN")} · {post.author.email}</div>
        <h1 className="mt-3 font-display text-6xl font-bold leading-none">{post.title}</h1>
        <article className="prose prose-invert mt-8 max-w-none text-[color:var(--soft)]" dangerouslySetInnerHTML={{ __html: safeContent }} />
      </main>
    </div>
  );
}
