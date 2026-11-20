"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Avatar } from "@/components/BlogImage";
import Notice from "@/components/Notice";
import { api, errorMessage } from "@/lib/api";
import { useResource } from "@/lib/use-resource";
import type { Profile } from "@/types/blog";

export default function ProfilePage() {
  const profile = useResource<Profile>("/me", true);
  if (profile.error) return <Notice message={profile.error.message} retry={profile.reload} />;
  if (!profile.data) return <p className="page-status">Loading profile…</p>;
  return <ProfileForm initial={profile.data} />;
}

function ProfileForm({ initial }: { initial: Profile }) {
  const [user, setUser] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setFeedback("");
    try {
      const body = Object.fromEntries(new FormData(event.currentTarget));
      const updated = await api<Profile>("/me", { method: "PUT", body });
      setUser(updated);
      window.dispatchEvent(new Event("authChange"));
      setFeedback("Profile saved.");
    } catch (cause) {
      setFeedback(errorMessage(cause));
    } finally {
      setBusy(false);
    }
  }
  return <main className="mx-auto max-w-4xl space-y-8 px-6 py-10 text-slate-900">
    <Link href="/dashboard" className="text-blue-700">← Dashboard</Link>
    <div className="flex items-center gap-4">
      <Avatar src={user.avatar} name={user.name} />
      <div><h1 className="text-3xl font-bold">Profile settings</h1><p>{user.name} · Joined {user.joinedAt}</p></div>
    </div>
    <form onSubmit={save} className="space-y-5 rounded-2xl border bg-white p-6">
      <h2 className="text-xl font-semibold">Personal information</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <label>Name<input className="field" name="name" required maxLength={100} defaultValue={user.name} /></label>
        <label>Username<input className="field" name="username" maxLength={80} defaultValue={user.username} /></label>
        <label>Email<input className="field" name="email" type="email" required maxLength={254} defaultValue={user.email} /></label>
        <label>Location<input className="field" name="location" maxLength={120} defaultValue={user.location} /></label>
        <label>Website<input className="field" name="website" type="url" maxLength={500} defaultValue={user.website} /></label>
        <label>Avatar URL<input className="field" name="avatar" maxLength={2048} defaultValue={user.avatar} /></label>
      </div>
      <label className="block">Bio<textarea className="field" name="bio" maxLength={1000} defaultValue={user.bio} /></label>
      <button disabled={busy} className="rounded-lg bg-blue-600 px-5 py-3 text-white">Save profile</button>
      {feedback && <p role="status">{feedback}</p>}
    </form>
    <PasswordForm />
  </main>;
}

function PasswordForm() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function change(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    if (fields.get("newPassword") !== fields.get("confirm")) {
      setMessage("The new passwords do not match.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      await api("/me/password", { method: "PUT", body: {
        currentPassword: fields.get("currentPassword"), newPassword: fields.get("newPassword"),
      } });
      form.reset();
      setMessage("Password updated.");
    } catch (cause) {
      setMessage(errorMessage(cause));
    } finally {
      setBusy(false);
    }
  }
  return <form onSubmit={change} className="space-y-5 rounded-2xl border bg-white p-6">
    <h2 className="text-xl font-semibold">Change password</h2>
    <label className="block">Current password<input className="field" name="currentPassword" type="password" autoComplete="current-password" required /></label>
    <label className="block">New password<input className="field" name="newPassword" type="password" autoComplete="new-password" required minLength={8} /></label>
    <label className="block">Confirm new password<input className="field" name="confirm" type="password" autoComplete="new-password" required /></label>
    <button disabled={busy} className="rounded-lg bg-blue-600 px-5 py-3 text-white">Update password</button>
    {message && <p role="status">{message}</p>}
  </form>;
}
