"use client";

import { useEffect, useState } from "react";
import type { ApiResponse, PublicPost } from "@/lib/types";

function excerpt(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 150);
}

export function LatestPostsSection() {
  const [posts, setPosts] = useState<PublicPost[]>([]);

  useEffect(() => {
    fetch("/api/posts?limit=3")
      .then((response) => response.json() as Promise<ApiResponse<PublicPost[]>>)
      .then((payload) => {
        if (payload.ok && payload.data) setPosts(payload.data);
      })
      .catch(() => setPosts([]));
  }, []);

  if (!posts.length) {
    return null;
  }

  return (
    <section className="section" id="news">
      <div className="section-head">
        <div>
          <div className="section-kicker">Tin mới</div>
          <h2>Cập nhật từ <em>H Club</em></h2>
        </div>
        <p>Nội dung CMS mới nhất được render động từ API bài viết.</p>
      </div>

      <div className="posts-grid">
        {posts.map((post) => (
          <article className="post-card" key={post.id}>
            <a href={`/posts/${post.slug}`}>
              {post.thumbnail ? <img className="aspect-[16/10] object-cover" src={post.thumbnail} alt={post.title} loading="lazy" decoding="async" /> : null}
              <div className="post-body">
                <h3>{post.title}</h3>
                <p>{excerpt(post.content)}</p>
              </div>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
