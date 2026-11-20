"use client";

import Link from "next/link";
import { useState } from "react";
import Swal from "sweetalert2";
import BlogImage from "@/components/BlogImage";
import Notice from "@/components/Notice";
import { api, errorMessage } from "@/lib/api";
import { useResource } from "@/lib/use-resource";
import type { Blog, Profile } from "@/types/blog";

export default function DashboardPage() {
  const profile = useResource<Profile>("/me", true);
  const list = useResource<Blog[]>("/me/blogs", true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function remove(post: Blog) {
    const choice = await Swal.fire({ title: "Delete this article?", text: post.title, icon: "warning",
      showCancelButton: true, confirmButtonText: "Delete", confirmButtonColor: "#b91c1c" });
    if (!choice.isConfirmed) return;
    setBusy(true);
    setError("");
    try {
      await api("/me/blogs/" + post.id, { method: "DELETE" });
      list.reload();
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setBusy(false);
    }
  }

  if (profile.error) return <Notice message={profile.error.message} retry={profile.reload} />;
  if (list.error) return <Notice message={list.error.message} retry={list.reload} />;
  if (!list.data || !profile.data) return <p className="page-status">Loading dashboard…</p>;
  const posts = list.data;
  const published = posts.filter(post => post.status === "Published").length;
  const stats = [["Posts", posts.length], ["Published", published], ["Drafts", posts.length - published],
    ["Views", posts.reduce((total, post) => total + post.views, 0)],
    ["Likes", posts.reduce((total, post) => total + post.likes, 0)],
    ["Comments", posts.reduce((total, post) => total + post.comments, 0)]];

  return <main className="mx-auto max-w-7xl space-y-8 px-6 py-10 text-slate-900">
    <header className="rounded-3xl bg-linear-to-r from-blue-600 to-indigo-600 p-8 text-white">
      <h1 className="text-3xl font-bold">Welcome back, {profile.data.name}</h1>
      <div className="mt-6 flex gap-3">
        <Link href="/write" className="rounded-lg bg-white px-5 py-3 font-semibold text-blue-700">Create post</Link>
        <Link href="/dashboard/profile" className="rounded-lg border border-white px-5 py-3">Manage profile</Link>
      </div>
    </header>
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">{stats.map(([label, count]) =>
      <div key={label} className="rounded-2xl border bg-white p-5"><strong className="text-2xl">{count}</strong><p>{label}</p></div>)}</div>
    <h2 className="text-2xl font-bold">Your posts</h2>
    {error && <Notice message={error} />}
    {!posts.length && <p className="rounded-2xl border bg-white p-8">No posts yet. Create your first article.</p>}
    {posts.map(post => <article key={post.id} className="flex flex-wrap items-center gap-5 rounded-2xl border bg-white p-5 shadow-sm">
      <BlogImage width={128} height={96} src={post.image} alt="" className="h-24 w-32 rounded-xl object-cover" />
      <div className="min-w-0 flex-1">
        <h3 className="break-words text-lg font-bold">{post.status === "Published" ? <Link href={"/articles/" + post.id}>{post.title}</Link> : post.title}</h3>
        <p>{post.status} · {post.category}{post.publishedAt && " · " + post.publishedAt}</p>
      </div>
      <div className="flex gap-4">
        <Link className="text-blue-700" href={"/dashboard/edit/" + post.id}>Edit</Link>
        <button disabled={busy} onClick={() => remove(post)} className="text-red-700">Delete</button>
      </div>
    </article>)}
  </main>;
}
