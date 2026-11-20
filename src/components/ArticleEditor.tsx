"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, errorMessage } from "@/lib/api";
import { useResource } from "@/lib/use-resource";
import type { ArticleInput, Blog, Category, Profile, Status } from "@/types/blog";
import BlogImage, { isImageAddress } from "./BlogImage";
import Notice from "./Notice";

export default function ArticleEditor({ id }: { id?: string }) {
  const categories = useResource<Category[]>("/categories");
  const source = useResource<Blog | Profile>(id ? "/me/blogs/" + encodeURIComponent(id) : "/me", true);
  if (source.error) return <Notice message={source.error.message} retry={source.error.status === 404 ? undefined : source.reload} />;
  if (categories.error) return <Notice message={categories.error.message} retry={categories.reload} />;
  if (!source.data || !categories.data) return <p className="page-status">Loading editor…</p>;
  if (!categories.data.length) return <Notice message="No categories are available." />;
  const article = "title" in source.data ? source.data : undefined;
  return <EditorForm key={id ?? "new"} article={article} categories={categories.data} />;
}

function EditorForm({ article, categories }: { article?: Blog; categories: Category[] }) {
  const router = useRouter();
  const [title, setTitle] = useState(article?.title ?? "");
  const [content, setContent] = useState(article?.content ?? "");
  const [category, setCategory] = useState(article?.category ?? categories[0].name);
  const [image, setImage] = useState(article?.image ?? "");
  const [status, setStatus] = useState<Status>(article?.status ?? "Published");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setError("");
    const address = image.trim();
    if (address && !isImageAddress(address)) {
      setError("Use an HTTPS image URL or a file under /images/.");
      return;
    }
    const button = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const body: ArticleInput = { title, content, category, image: address, status: button?.value === "Draft" ? "Draft" : status };
    setBusy(true);
    try {
      await api<Blog>(article ? "/me/blogs/" + article.id : "/me/blogs", { method: article ? "PUT" : "POST", body });
      router.push("/dashboard");
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setBusy(false);
    }
  }

  return <main className="mx-auto max-w-7xl px-6 py-10 text-slate-900">
    <h1 className="mb-8 text-3xl font-bold">{article ? "Edit article" : "Write an article"}</h1>
    <div className="grid gap-8 lg:grid-cols-3">
      <form onSubmit={save} className="space-y-5 rounded-2xl border bg-white p-6 shadow-sm lg:col-span-2">
        <label className="block">Title<input className="field" value={title} maxLength={240} required onChange={e => setTitle(e.target.value)} /></label>
        <label className="block">Category<select className="field" value={category} onChange={e => setCategory(e.target.value)}>
          {categories.map(c => <option key={c.id}>{c.name}</option>)}
        </select></label>
        <label className="block">Cover image (optional)<input className="field" value={image} maxLength={2048}
          placeholder="https://example.com/cover.jpg" onChange={e => setImage(e.target.value)} /></label>
        <label className="block">Content<textarea className="field min-h-72" value={content} required maxLength={40000} onChange={e => setContent(e.target.value)} /></label>
        {article && <label className="block">Status<select className="field" value={status} onChange={e => setStatus(e.target.value as Status)}>
          <option>Published</option><option>Draft</option>
        </select></label>}
        {error && <p role="alert" className="text-red-700">{error}</p>}
        <div className="flex flex-wrap items-center gap-4">
          <button disabled={busy} className="rounded-lg bg-blue-600 px-5 py-3 text-white disabled:opacity-50">{article ? "Save changes" : "Publish"}</button>
          {!article && <button value="Draft" disabled={busy} className="rounded-lg border px-5 py-3">Save draft</button>}
          <Link href="/dashboard" className="text-slate-600 underline">Cancel</Link>
        </div>
      </form>
      <aside className="h-fit space-y-4 rounded-2xl border bg-white p-6">
        <h2 className="font-semibold">Preview</h2>
        <BlogImage width={480} height={240} className="h-48 w-full rounded-xl object-cover" alt="Cover preview"
          src={isImageAddress(image) ? image : categories.find(c => c.name === category)?.image ?? ""} />
        <p className="text-sm text-blue-700">{category}</p>
        <h3 className="break-words text-xl font-semibold">{title}</h3>
        <p className="whitespace-pre-wrap break-words">{content}</p>
      </aside>
    </div>
  </main>;
}
