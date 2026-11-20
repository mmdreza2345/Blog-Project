"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import BlogImage, { Avatar } from "@/components/BlogImage";
import Comments from "@/components/Comments";
import Notice from "@/components/Notice";
import { useResource } from "@/lib/use-resource";
import type { Blog } from "@/types/blog";

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const article = useResource<Blog>("/blogs/" + encodeURIComponent(id));
  const related = useResource<Blog[]>("/blogs");
  if (article.error) return <Notice message={article.error.message} retry={article.error.status === 404 ? undefined : article.reload} />;
  const blog = article.data;
  if (!blog) return <p className="page-status">Loading article…</p>;
  const suggestions = related.data?.filter(other => blog.id !== other.id && other.category === blog.category) ?? [];
  return <main className="mx-auto grid max-w-7xl gap-10 px-6 py-10 text-slate-900 lg:grid-cols-3">
    <article className="min-w-0 lg:col-span-2">
      <Link className="rounded-full bg-blue-50 px-4 py-2 text-blue-700" href={"/articles?category=" + encodeURIComponent(blog.category)}>{blog.category}</Link>
      <h1 className="mt-5 break-words text-4xl font-bold">{blog.title}</h1>
      <div className="mt-4 flex items-center gap-3 text-slate-600"><Avatar name={blog.author} src={blog.avatar} />
        <span>By {blog.author} · {blog.publishedAt} · {blog.readingTime}</span>
      </div>
      <BlogImage src={blog.image} alt={blog.title} width={960} height={480} className="mt-8 max-h-96 w-full rounded-2xl object-cover" />
      <div className="mt-8 whitespace-pre-wrap break-words text-base leading-8">{blog.content}</div>
      <Comments key={blog.id} id={blog.id} />
    </article>
    <aside className="h-fit space-y-3 rounded-2xl border bg-white p-5">
      <h2 className="text-lg font-semibold">Related articles</h2>
      {related.error && <Notice message={related.error.message} retry={related.reload} />}
      {suggestions.map(other => <Link className="block text-blue-700 hover:underline" key={other.id} href={"/articles/" + other.id}>{other.title}</Link>)}
      {related.data && !suggestions.length && <Link className="block text-blue-700" href="/articles">Browse all articles</Link>}
    </aside>
  </main>;
}
