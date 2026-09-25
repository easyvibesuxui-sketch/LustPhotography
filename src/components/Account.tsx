"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn, signOut, useMe } from "@/lib/auth";
import { TIER_LABEL } from "@/lib/tiers";

const field = "w-full rounded-sm border border-ivory/20 bg-forest/80 px-4 py-3.5 text-sm placeholder:text-parchment/50 focus:border-brass focus:outline-none";

export default function Account() {
  const { me, ready } = useMe();
  const [mode, setMode] = useState<"login" | "register">("register");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (!ready) return <p className="label">Loading…</p>;

  if (me) {
    return (
      <div className="w-full max-w-md rounded-md border border-brass/30 bg-bottle/60 p-8 text-center">
        <p className="label">Your account</p>
        <h1 className="mt-4 font-hero text-4xl">Benvenuta.</h1>
        <p className="mt-2 break-all text-parchment/80">{me.email}</p>
        <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-brass/50 px-4 py-2 font-ui text-sm font-semibold uppercase tracking-[0.15em]">
          Plan: <span className="text-brass">{me.tier === "free" ? "Free" : TIER_LABEL[me.tier]}</span>
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Link href="/#shorts" className="btn btn-wine">Watch now</Link>
          {me.tier !== "maison" && <Link href="/pricing/" className="btn btn-brass">Upgrade</Link>}
          <button onClick={() => signOut()} className="mt-2 text-sm text-parchment/70 underline-offset-4 hover:underline">
            Sign out
          </button>
        </div>
      </div>
    );
  }

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    const res = await signIn(mode, { email: f.get("email"), password: f.get("password"), adult: f.get("adult") === "on" });
    setBusy(false);
    if (res.error) setError(res.error);
  };

  return (
    <div className="w-full max-w-md rounded-md border border-brass/30 bg-bottle/60 p-8">
      <div className="mb-8 grid grid-cols-2 rounded-full border border-ivory/15 p-1" role="tablist">
        {(["register", "login"] as const).map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={mode === m}
            onClick={() => (setMode(m), setError(""))}
            className={`rounded-full py-2 font-ui text-sm font-semibold uppercase tracking-[0.12em] ${mode === m ? "bg-brass text-forest" : "text-parchment/70"}`}
          >
            {m === "register" ? "Join free" : "Sign in"}
          </button>
        ))}
      </div>
      <h1 className="font-hero text-4xl leading-tight">
        {mode === "register" ? <>Enter the <em className="text-brass">villa.</em></> : <>Welcome <em className="text-brass">back.</em></>}
      </h1>
      <form onSubmit={submit} className="mt-6 grid gap-3">
        <label className="sr-only" htmlFor="acc-email">Email</label>
        <input id="acc-email" name="email" type="email" required autoComplete="email" placeholder="Email address" className={field} />
        <label className="sr-only" htmlFor="acc-pass">Password</label>
        <input
          id="acc-pass"
          name="password"
          type="password"
          required
          minLength={mode === "register" ? 8 : undefined}
          autoComplete={mode === "register" ? "new-password" : "current-password"}
          placeholder={mode === "register" ? "Password (8+ characters)" : "Password"}
          className={field}
        />
        {mode === "register" && (
          <label className="mt-1 flex items-start gap-3 text-xs leading-relaxed text-parchment/80">
            <input name="adult" type="checkbox" required className="mt-0.5 h-4 w-4 accent-[var(--color-brass)]" />
            I confirm I am 18 or older and accept the Terms and Privacy Policy.
          </label>
        )}
        {error && <p className="text-sm text-wine-hot" role="alert">{error}</p>}
        <button className="btn btn-wine mt-3 disabled:opacity-60" disabled={busy}>
          {busy ? "One moment…" : mode === "register" ? "Create free account" : "Sign in"}
        </button>
      </form>
      <p className="mt-6 text-center text-xs text-parchment/60">
        Free members unlock selected reels. <Link href="/pricing/" className="text-brass underline-offset-4 hover:underline">See all plans</Link>
      </p>
    </div>
  );
}
