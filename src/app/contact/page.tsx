"use client";

import { useState, type FormEvent } from "react";
import { api, errorMessage } from "@/lib/api";

export default function ContactPage() {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    setBusy(true);
    setStatus("");
    try {
      await api("/contact", { method: "POST", body: Object.fromEntries(new FormData(form)) });
      form.reset();
      setStatus("Your message was saved. Thanks for the feedback.");
    } catch (cause) {
      setStatus(errorMessage(cause));
    } finally {
      setBusy(false);
    }
  }

  return <main className="mx-auto max-w-3xl px-6 py-12 text-slate-900">
    <h1 className="text-4xl font-bold">Contact the team</h1>
    <p className="mt-2 text-slate-600">Send feedback to the maintainers of this blog.</p>
    <form onSubmit={submit} className="mt-8 space-y-5 rounded-2xl border bg-white p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <label>Name<input className="field" name="name" autoComplete="name" required maxLength={100} /></label>
        <label>Email<input className="field" name="email" type="email" autoComplete="email" required maxLength={254} /></label>
      </div>
      <label className="block">Subject<input className="field" name="subject" required maxLength={200} /></label>
      <label className="block">Message<textarea className="field" name="message" rows={7} required maxLength={8000} /></label>
      <button disabled={busy} className="rounded-lg bg-blue-600 px-5 py-3 text-white">{busy ? "Sending…" : "Send message"}</button>
      {status && <p role="status">{status}</p>}
    </form>
  </main>;
}
