"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api, errorMessage } from "@/lib/api";
import { useResource } from "@/lib/use-resource";
import type { Profile } from "@/types/blog";

const links = [
  ["/", "Home"], ["/articles", "Articles"], ["/categories", "Categories"],
  ["/about", "About"], ["/contact", "Contact"],
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { data, reload } = useResource<{ user: Profile | null }>("/session");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    // Earlier releases cached the whole user record including its password.
    try { window.localStorage.removeItem("user"); } catch { /* Storage may be disabled. */ }
    window.addEventListener("authChange", reload);
    return () => window.removeEventListener("authChange", reload);
  }, [reload]);

  async function logout() {
    setBusy(true);
    setError("");
    try {
      await api("/auth/logout", { method: "POST" });
      reload();
      router.replace("/auth/login");
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setBusy(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white text-slate-800">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-4">
        <Link href="/" className="text-2xl font-bold text-blue-600">B-lock</Link>
        <nav aria-label="Site" className="order-last flex w-full flex-wrap gap-4 md:order-none md:w-auto">
          {links.map(([url, label]) => <Link key={url} href={url} aria-current={pathname === url ? "page" : undefined}
            className={pathname === url ? "text-blue-700" : "hover:text-blue-700"}>{label}</Link>)}
        </nav>
        <div className="flex items-center gap-3 text-sm font-medium">
          {data?.user ? <>
            <Link href="/dashboard">Dashboard</Link><Link href="/write">Write Blog</Link>
            <button onClick={logout} disabled={busy}>Log out</button>
          </> : <>
            <Link href="/auth/login">Log in</Link>
            <Link className="rounded-lg bg-blue-600 px-4 py-2 text-white" href="/auth/register">Sign up</Link>
          </>}
        </div>
      </div>
      {error && <p role="alert" className="px-6 pb-2 text-red-700">{error}</p>}
    </header>
  );
}
