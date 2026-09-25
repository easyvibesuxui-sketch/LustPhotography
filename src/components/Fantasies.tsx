"use client";

import Link from "next/link";
import { useState } from "react";
import { fantasies, reelBySlug } from "@/lib/data";
import ArtFrame from "./ArtFrame";
import Reveal from "./Reveal";

export default function Fantasies() {
  const [sent, setSent] = useState(false);
  return (
    <div className="gutter grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
      <Reveal>
        <p className="label mb-4">Fantasy submissions</p>
        <h2 className="font-hero text-5xl leading-[0.95] md:text-7xl">
          Whisper us your fantasy.
          <br />
          <em className="text-brass">We&apos;ll bring it to life.</em>
        </h2>
        <p className="mt-6 max-w-md leading-relaxed text-parchment/80">
          Every month our studio turns a handful of anonymous fantasies into AI-imagined reels. If yours is chosen, you&apos;ll be credited by nickname.
        </p>
        {sent ? (
          <p className="mt-10 font-display text-3xl italic text-brass">Grazie. Your secret is safe with us.</p>
        ) : (
          <form className="mt-10 grid gap-4" onSubmit={(e) => (e.preventDefault(), setSent(true))}>
            <label className="grid gap-2 text-xs uppercase tracking-[0.2em] text-parchment/70">
              Nickname
              <input required maxLength={32} placeholder="e.g. lazy_lucia" className="rounded-sm border border-ivory/20 bg-bottle/60 px-4 py-3.5 text-base normal-case tracking-normal text-ivory placeholder:text-parchment/40 focus:border-brass focus:outline-none" />
            </label>
            <label className="grid gap-2 text-xs uppercase tracking-[0.2em] text-parchment/70">
              Your fantasy
              <textarea required rows={4} maxLength={1200} placeholder="A borrowed key, a shuttered villa, a whole afternoon…" className="resize-none rounded-sm border border-ivory/20 bg-bottle/60 px-4 py-3.5 font-display text-xl normal-case italic tracking-normal text-ivory placeholder:text-parchment/40 focus:border-brass focus:outline-none" />
            </label>
            <label className="flex items-start gap-3 text-xs leading-relaxed text-parchment/75">
              <input type="checkbox" required className="mt-0.5 h-4 w-4 accent-[var(--color-brass)]" />
              I confirm I am 18+, my fantasy involves only consenting adults and fictional characters, and I agree to the submission terms.
            </label>
            <button className="btn btn-wine mt-2 justify-self-start">Send in secret</button>
          </form>
        )}
      </Reveal>
      <div className="grid content-start gap-4">
        {fantasies.map((f, i) => {
          const r = reelBySlug(f.reel)!;
          return (
            <Reveal key={f.by} delay={i * 0.1}>
              <Link href={`/watch/${r.slug}`} className="group grid grid-cols-[110px_1fr] gap-5 rounded-md border border-brass/15 bg-bottle/40 p-3 transition-colors hover:border-brass/60 md:grid-cols-[150px_1fr]" data-cursor="Play">
                <div className="media aspect-[4/5]">
                  <div className="art group-hover:scale-105">
                    <ArtFrame {...r} seed={r.slug + "f"} alt={r.title} />
                  </div>
                </div>
                <div className="py-2 pr-2">
                  <p className="font-display text-xl italic leading-snug text-ivory/90 md:text-2xl">&ldquo;{f.text}&rdquo;</p>
                  <p className="mt-4 flex flex-wrap items-center gap-2 text-xs text-parchment/70">
                    Based on a fantasy by <span className="pill pill-ghost normal-case">@{f.by}</span>
                  </p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-brass">▶ {r.title}</p>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
