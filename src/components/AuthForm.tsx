"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { api, errorMessage } from "@/lib/api";
import { useResource } from "@/lib/use-resource";
import type { Profile } from "@/types/blog";

export default function AuthForm({ register = false }: { register?: boolean }) {
  const router = useRouter();
  const { data } = useResource<{ user: Profile | null }>("/session");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (data?.user) router.replace("/dashboard");
  }, [data, router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const fields = new FormData(event.currentTarget);
    const email = String(fields.get("email") ?? "").trim();
    const password = String(fields.get("password") ?? "");
    setError("");
    if (register && password !== fields.get("confirm")) {
      setError("The passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      if (register) {
        await api("/auth/register", { method: "POST", body: { name: fields.get("name"), email, password } });
        router.replace("/auth/login?registered=1");
      } else {
        await api("/auth/login", { method: "POST", body: { email, password } });
        window.dispatchEvent(new Event("authChange"));
        router.replace("/dashboard");
      }
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-md px-6 py-16 text-slate-900">
      <h1 className="text-center text-3xl font-bold text-blue-600">{register ? "Create your account" : "Welcome back"}</h1>
      <form onSubmit={submit} className="mt-6 space-y-5 rounded-2xl border bg-white p-6 shadow-sm">
        {register && <label className="block">Name<input className="field" name="name" autoComplete="name" required maxLength={100} /></label>}
        <label className="block">Email<input className="field" name="email" type="email" autoComplete="email" maxLength={254} required /></label>
        <label className="block">Password<input className="field" name="password" type="password"
          autoComplete={register ? "new-password" : "current-password"} minLength={register ? 8 : undefined} required /></label>
        {register && <label className="block">Confirm password<input className="field" name="confirm" type="password" autoComplete="new-password" required /></label>}
        {error && <p role="alert" className="text-red-700">{error}</p>}
        <button disabled={busy} className="w-full rounded-lg bg-blue-600 px-5 py-3 text-white disabled:opacity-50">
          {busy ? "Please wait…" : register ? "Create account" : "Log in"}
        </button>
        <Link href={register ? "/auth/login" : "/auth/register"} className="block text-center text-blue-700 underline">
          {register ? "Already registered? Log in" : "Create an account"}
        </Link>
      </form>
    </main>
  );
}
