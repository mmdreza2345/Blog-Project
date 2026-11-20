"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "@/components/BlogImage";
import Notice from "@/components/Notice";
import { useResource } from "@/lib/use-resource";
import type { Blog, Category } from "@/types/blog";

export default function HomePage() {
  const posts = useResource<Blog[]>("/blogs");
  const topics = useResource<Category[]>("/categories");
  const blogs = posts.data ?? [];
  const categories = topics.data ?? [];
  const [query, setQuery] = useState({ text: "", category: "All" });
  const [searchValue, setSearchValue] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState("All");
  const searchHandler = () => {
    setQuery({ text: searchValue.trim().toLowerCase(), category: selectedCategory });
  };
  const filteredBlogs = blogs.filter(post =>
    (post.title.toLowerCase().includes(query.text) || post.category.toLowerCase().includes(query.text)) &&
    (query.category === "All" || post.category === query.category)
  );
  return (
    <main className="min-h-screen bg-[#f7f9fc] text-slate-900">

      {/* HERO */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-20 md:grid-cols-2">

        {/* Left */}
        <div>
          <span className="inline-block rounded-full bg-blue-50 px-4 py-1 text-xs text-blue-600">
            Write your story. Inspire the world.
          </span>

          <h1 className="mt-6 text-5xl font-bold leading-tight">
            Learn. Write. <br />
            <span className="text-blue-600">Share.</span>
          </h1>

          <p className="mt-5 text-slate-600">
            A modern platform for developers to share knowledge, learn new technologies,
            and grow together.
          </p>

          <div className="mt-8 flex gap-3">
            <Link href={"/articles"}>
              <button className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 cursor-pointer">
                Start Reading
              </button>
            </Link>
            <Link href={"/write"}>
              <button className="rounded-lg border px-5 py-3 hover:bg-white cursor-pointer">
                Write Article
              </button>
            </Link>
          </div>
        </div>

        {/* Right Illustration */}
        <div className="hidden md:block">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-tr from-blue-100 to-slate-100 p-6 shadow-sm">
            <Image
              src="/images/blogs.png"
              alt="Blog Illustration"
              width={700}
              height={700}
              className="h-auto w-full"
              priority
            />
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-3 rounded-2xl border bg-white p-3 shadow-sm md:flex-row">

          <input
            className="flex-1 px-4 py-3 outline-none"
            placeholder="Search articles..."
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);

              if (e.target.value === "") {
                setQuery({ text: "", category: selectedCategory })
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchHandler();
              }
            }}
          />

          <select onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory} className="rounded-lg border px-4 py-3 text-slate-600">
            <option value="All">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>{category.name}</option>
            ))}
          </select>

          <button onClick={searchHandler} className="rounded-lg bg-blue-600 px-6 py-3 text-white">
            Search
          </button>
        </div>
      </section>

      {posts.error && <Notice message={posts.error.message} retry={posts.reload} />}
      {topics.error && <Notice message={topics.error.message} retry={topics.reload} />}
      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Categories</h2>
          <Link className="text-sm text-blue-600" href="/categories">View all →</Link>
        </div>

        <div className="mt-5 flex flex-wrap gap-6">
          {categories.slice(0, 6).map((post) => (
            <div
              key={post.id}
              className="flex flex-1 min-w-[150px] flex-col items-center justify-center rounded-xl border bg-white p-4 text-sm hover:shadow-sm"
            >
              <div className="mb-2 h-10 w-10 overflow-hidden rounded-full bg-blue-50">
                <Image
                  src={post.image}
                  alt={post.name}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </div>
              {post.name}
              <span className="text-xs text-slate-400">{post.count} posts</span>
            </div>
          ))}
        </div>
      </section>

      {/* LATEST POSTS */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Latest Posts</h2>
          <Link className="text-sm text-blue-600" href="/articles">View all →</Link>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          {posts.loading ? <p>Loading articles…</p> : filteredBlogs.length === 0 ? <p>No articles found.</p> : filteredBlogs.slice(0, 4).map((post) => (
            <Link href={`/articles/${post.id}`} key={post.id}>
              <article className="flex h-full flex-col overflow-hidden rounded-2xl border bg-white transition hover:shadow-md">
                <Image
                  src={post.image}
                  alt={post.title}
                  width={600}
                  height={400}
                  className="h-40 w-full object-cover"
                />

                <div className="flex flex-1 flex-col p-4">
                  <span className="rounded bg-purple-100 px-2 py-1 text-xs text-purple-700 w-fit">
                    {post.category}
                  </span>

                  <h3 className="mt-3 font-semibold">
                    {post.title}
                  </h3>

                  <p className="mt-2 text-sm text-slate-600">
                    {post.excerpt}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-4 text-xs text-slate-400">
                    <span>{post.author}</span>
                    <span>{post.readingTime}</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      {/* POPULAR POSTS */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <h2 className="text-xl font-semibold">Popular Posts</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">

          {posts.loading ? <p>Loading articles…</p> : filteredBlogs.length === 0 ? <p>No articles found.</p> : [...filteredBlogs].sort((a, b) => b.views - a.views).slice(0, 4).map((post) => (
            <div key={post.id} className="flex gap-4 rounded-xl border bg-white p-4 hover:shadow-sm">

              <Image
                src={post.image}
                alt={post.title}
                width={64}
                height={64}
                className="h-16 w-16 rounded-lg object-cover"
              />

              <div>
                <h4 className="text-sm font-semibold">
                  {post.title}
                </h4>

                <p className="text-xs text-slate-400 mt-1">
                  {post.views} views
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t bg-white px-6 py-6 text-center text-sm text-slate-500">
        B-lock · <Link href="/about" className="underline">About</Link> · <Link href="/contact" className="underline">Contact</Link>
      </footer>
    </main>
  );
}
