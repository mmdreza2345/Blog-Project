"use client";

import Image from "@/components/BlogImage";
import Notice from "@/components/Notice";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useResource } from "@/lib/use-resource";
import type { Blog, Category } from "@/types/blog";

export default function ArticlesPage() {
    return <Suspense fallback={<p className="page-status">Loading articles…</p>}><CategoryResults /></Suspense>;
}

function CategoryResults() {
    const initial = useSearchParams().get("category") || "All";
    return <Articles key={initial} initialCategory={initial} />;
}

function Articles({ initialCategory }: { initialCategory: string }) {
    const posts = useResource<Blog[]>("/blogs");
    const topics = useResource<Category[]>("/categories");
    const blogs = posts.data ?? [];
    const categories = topics.data ?? [];
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const categoryFiltered = selectedCategory === "All" ? blogs : blogs.filter((blog) => blog.category === selectedCategory)
    const [searchValue, setSearchValue] = useState<string>("");
    const filteredBlogs = categoryFiltered.filter(blog =>
        blog.title?.toLowerCase().includes(searchValue.toLowerCase()) ||
        blog.excerpt?.toLowerCase().includes(searchValue.toLowerCase()) ||
        blog.author?.toLowerCase().includes(searchValue.toLowerCase())
    )
    const [currentPage, setCurrentPage] = useState<number>(1);
    const blogsPerPage = 6;
    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
    if (posts.error || topics.error) return <Notice message={(posts.error ?? topics.error)!.message} retry={() => { posts.reload(); topics.reload(); }} />;
    if (posts.loading || topics.loading) return <p className="page-status">Loading articles…</p>;
    return (
        <main className="min-h-screen bg-[#f7f9fc] text-slate-900">

            {/* HERO */}
            <section className="mx-auto max-w-7xl px-6 pb-10">
                <h1 className="text-4xl font-bold">Articles</h1>
                <p className="mt-2 text-slate-600">
                    Explore tutorials, insights and development guides.
                </p>
            </section>

            {/* SEARCH */}
            <section className="mx-auto max-w-7xl px-6 mb-8">
                <div className="flex flex-col gap-3 rounded-2xl border bg-white p-3 shadow-sm md:flex-row">

                    <input
                        className="flex-1 px-4 py-3 outline-none"
                        placeholder="Search articles..."
                        value={searchValue}
                        onChange={(e) => {
                            setSearchValue(e.target.value)
                            setCurrentPage(1)
                        }}
                    />

                    <select onChange={(e) => {
                        setSelectedCategory(e.target.value)
                        setCurrentPage(1)
                    }} value={selectedCategory} className="cursor-pointer rounded-lg border px-4 py-3 text-slate-600">
                        <option value="All">All Categories</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.name}>{category.name}</option>
                        ))}
                    </select>
                </div>
            </section>

            {/* FILTER BAR */}
            <section className="mx-auto max-w-7xl px-6">
                <div className="flex flex-wrap gap-3">
                    <button
                        className={selectedCategory === "All" ? "cursor-pointer rounded-full border bg-blue-100 px-4 py-2 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600" : "cursor-pointer rounded-full border bg-white px-4 py-2 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600"}
                        onClick={() => { setSelectedCategory("All"); setCurrentPage(1); }}
                    >
                        All
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            className={selectedCategory === category.name ? "cursor-pointer rounded-full border bg-blue-100 px-4 py-2 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600" : "cursor-pointer rounded-full border bg-white px-4 py-2 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600"}
                            onClick={() => { setSelectedCategory(category.name); setCurrentPage(1); }}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </section>

            {/* MAIN GRID */}
            <section className="mx-auto max-w-7xl px-6 py-10">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                    {filteredBlogs.length === 0 ?
                        <p className="col-span-full text-center text-3xl">🔍 No articles found.</p> :
                        filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog).map((blog) => (
                            <Link key={blog.id} href={`/articles/${blog.id}`}>
                                <article

                                    className="group flex flex-col overflow-hidden rounded-2xl border bg-white transition hover:-translate-y-1 hover:shadow-lg"
                                >
                                    {/* IMAGE */}
                                    <div className="relative h-48 w-full overflow-hidden">
                                        {blog.image ? (
                                            <Image
                                                src={blog.image}
                                                alt={blog.title}
                                                fill
                                                className="object-cover transition duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-slate-200 text-slate-500">
                                                No Image
                                            </div>
                                        )}
                                    </div>

                                    {/* CONTENT */}
                                    <div className="flex flex-1 flex-col p-5">
                                        <span className="inline-block self-start rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                                            {blog.category}
                                        </span>

                                        <h2 className="mt-3 line-clamp-2 text-lg font-bold text-slate-800 transition group-hover:text-blue-600">
                                            {blog.title}
                                        </h2>

                                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                                            {blog.excerpt}
                                        </p>

                                        <div className="mt-auto flex items-center justify-between border-t pt-4 text-xs text-slate-400">
                                            <span>{blog.author}</span>
                                            <span>{blog.readingTime}</span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                </div>
            </section>

            {/* PAGINATION */}
            <section className={filteredBlogs.length === 0 ? "hidden" : "mx-auto max-w-7xl px-6 pb-16 flex justify-center gap-2"}>
                <button
                    className={currentPage === 1 ? "cursor-pointer px-5 py-3 rounded-lg bg-gray-400 line-through text-white font-bold" : "cursor-pointer px-5 py-3 rounded-lg bg-red-400 text-white font-bold"}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Prev
                </button>
                {Array.from({ length: totalPages }).map((_, index) => {
                    const pageNumber = index + 1;
                    return (
                        <button key={pageNumber} onClick={() => setCurrentPage(pageNumber)} className={currentPage === pageNumber
                            ? "cursor-pointer px-5 py-3 rounded-lg bg-blue-400 text-white font-bold"
                            : "cursor-pointer px-5 py-3 rounded-lg border bg-white hover:bg-slate-50 font-bold"}>
                            {pageNumber}
                        </button>
                    )
                })}
                <button
                    className={currentPage === totalPages ? "cursor-pointer px-5 py-3 rounded-lg bg-gray-400 line-through text-white font-bold" : "cursor-pointer px-5 py-3 rounded-lg bg-red-400 text-white font-bold"}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </section>

        </main>
    );
}