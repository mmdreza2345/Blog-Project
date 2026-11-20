"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError, errorMessage } from "./api";

export function useResource<T>(path: string, requireLogin = false) {
  const router = useRouter();
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ path: string; data?: T; error?: ApiError } | null>(null);
  const reload = useCallback(() => setAttempt((value) => value + 1), []);

  useEffect(() => {
    const request = new AbortController();
    api<T>(path, { signal: request.signal })
      .then((data) => {
        if (!request.signal.aborted) setResult({ path, data });
      })
      .catch((error: unknown) => {
        if (request.signal.aborted) return;
        if (requireLogin && error instanceof ApiError && error.status === 401) {
          router.replace("/auth/login");
        }
        setResult({ path, error: error instanceof ApiError ? error : new ApiError(0, errorMessage(error)) });
      });
    return () => request.abort();
  }, [path, requireLogin, attempt, router]);

  const current = result?.path === path ? result : null;
  return { data: current?.data, error: current?.error, loading: current === null, reload };
}
