"use client";

import { useEffect, useState } from "react";
import type { Tier } from "./tiers";

export type Me = { email: string; tier: Tier } | null;

// One shared /api/me request; components subscribe to changes after login/logout.
let current: Me | undefined;
let pending: Promise<Me> | null = null;
const listeners = new Set<(m: Me) => void>();

function set(m: Me) {
  current = m;
  listeners.forEach((l) => l(m));
}

export function loadMe(): Promise<Me> {
  if (current !== undefined) return Promise.resolve(current);
  pending ??= fetch("/api/me", { credentials: "same-origin" })
    .then((r) => (r.ok ? r.json() : { user: null }))
    .then((d: { user: Me }) => (set(d.user ?? null), d.user ?? null))
    .catch(() => (set(null), null))
    .finally(() => (pending = null));
  return pending;
}

export function useMe(): { me: Me; ready: boolean } {
  const [me, setMe] = useState<Me | undefined>(current);
  useEffect(() => {
    listeners.add(setMe);
    loadMe();
    return () => void listeners.delete(setMe);
  }, []);
  return { me: me ?? null, ready: me !== undefined };
}

export async function post<T = Record<string, unknown>>(path: string, data: unknown): Promise<T & { error?: string }> {
  try {
    const r = await fetch(path, {
      method: "POST",
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });
    return (await r.json().catch(() => ({ error: "Something went wrong." }))) as T & { error?: string };
  } catch {
    return { error: "Network error — try again." } as T & { error?: string };
  }
}

export async function signIn(mode: "login" | "register", data: Record<string, unknown>) {
  const res = await post<{ user?: Me }>(`/api/${mode}`, data);
  if (!res.error) set(res.user ?? null);
  return res;
}

export async function signOut() {
  await post("/api/logout", {});
  set(null);
}
