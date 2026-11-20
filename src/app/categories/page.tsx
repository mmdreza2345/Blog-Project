"use client";

import Link from "next/link";
import BlogImage from "@/components/BlogImage";
import Notice from "@/components/Notice";
import { useResource } from "@/lib/use-resource";
import type { Category } from "@/types/blog";

export default function CategoriesPage() {
  const topics = useResource<Category[]>("/categories");
  if (topics.error) return <Notice message={topics.error.message} retry={topics.reload} />;
  return <main className="mx-auto max-w-7xl px-6 py-12 text-slate-900">
    <h1 className="text-4xl font-bold">Categories</h1>
    <p className="mt-2 text-slate-600">Browse articles by technology and topic.</p>
    {topics.loading && <p className="page-status">Loading categories…</p>}
    <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {topics.data?.map(category => <Link key={category.id} href={"/articles?category=" + encodeURIComponent(category.name)}
        className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md">
        <BlogImage src={category.image} width={48} height={48} alt="" className="h-12 w-12 rounded-xl object-cover" />
        <h2 className="mt-4 text-xl font-semibold">{category.name}</h2>
        <p className="mt-3 text-slate-600">{category.count} published {category.count === 1 ? "article" : "articles"}</p>
      </Link>)}
    </div>
  </main>;
}
