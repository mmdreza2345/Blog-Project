"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { api, errorMessage } from "@/lib/api";
import { useResource } from "@/lib/use-resource";
import type { ArticleComment, Profile } from "@/types/blog";
import Notice from "./Notice";

export default function Comments({ id }: { id: number }) {
  const path = "/blogs/" + id + "/comments";
  const comments = useResource<ArticleComment[]>(path);
  const session = useResource<{ user: Profile | null }>("/session");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !body.trim()) return;
    setBusy(true);
    setError("");
    try {
      await api(path, { method: "POST", body: { body } });
      setBody("");
      comments.reload();
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setBusy(false);
    }
  }
  return <section className="mt-10 space-y-4">
    <h2 className="text-xl font-semibold">Comments</h2>
    {comments.error && <Notice message={comments.error.message} retry={comments.reload} />}
    {comments.data?.length === 0 && <p>No comments yet.</p>}
    {comments.data?.map(comment => <div key={comment.id} className="rounded-xl border bg-white p-4">
      <strong>{comment.author}</strong><p className="mt-2 whitespace-pre-wrap break-words">{comment.body}</p>
    </div>)}
    {session.error ? <Notice message={session.error.message} retry={session.reload} /> : session.data?.user ? <form onSubmit={submit} className="space-y-2">
      <label>Write a comment<textarea className="field" value={body} maxLength={2000} required onChange={e => setBody(e.target.value)} /></label>
      <button disabled={busy || !body.trim()} className="rounded-lg bg-blue-600 px-5 py-2 text-white">Post comment</button>
      {error && <p role="alert">{error}</p>}
    </form> : session.data && <Link href="/auth/login" className="text-blue-700 underline">Log in to comment</Link>}
  </section>;
}
