"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { museBySlug, type Reel } from "@/lib/data";
import ArtFrame from "./ArtFrame";
import { lockScroll } from "./SmoothScroll";
import { ArrowDownIcon, ArrowUpIcon, CloseIcon, HeartIcon, ShareIcon } from "./Icons";

// Fullscreen vertical reel viewer: swipe / wheel / arrow keys, TikTok-style.
export default function ReelViewer({ reels, start, onClose }: { reels: Reel[]; start: number; onClose: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(start);
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    lockScroll(true);
    const el = box.current!;
    el.children[start]?.scrollIntoView({ behavior: "instant" as ScrollBehavior });
    el.focus();
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.i))),
      { root: el, threshold: 0.6 },
    );
    Array.from(el.children).forEach((c) => io.observe(c));
    return () => {
      io.disconnect();
      lockScroll(false);
    };
  }, [start]);

  const go = (d: number) => {
    const i = Math.max(0, Math.min(reels.length - 1, active + d));
    box.current?.children[i]?.scrollIntoView({ behavior: "smooth" });
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if (["ArrowDown", "j", "PageDown"].includes(e.key)) (e.preventDefault(), go(1));
    if (["ArrowUp", "k", "PageUp"].includes(e.key)) (e.preventDefault(), go(-1));
  };

  const iconBtn = "flex h-12 w-12 flex-col items-center justify-center rounded-full bg-forest/60 text-lg text-ivory backdrop-blur transition hover:bg-brass hover:text-forest";

  return (
    <div className="fixed inset-0 z-[80] bg-[#060b08]/95 backdrop-blur-md" role="dialog" aria-modal="true" aria-label="Shorts viewer" onKeyDown={onKey}>
      <button onClick={onClose} className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-brass/40 text-xl text-ivory hover:bg-brass hover:text-forest" aria-label="Close viewer">
        <CloseIcon />
      </button>
      <div className="absolute left-4 top-5 z-10 hidden md:block">
        <p className="label">Lust Shorts</p>
        <p className="mt-1 text-xs text-parchment/70">Arrow keys to browse · Esc to close</p>
      </div>
      <div className="absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-3 md:flex">
        <button className={iconBtn} onClick={() => go(-1)} aria-label="Previous short"><ArrowUpIcon /></button>
        <button className={iconBtn} onClick={() => go(1)} aria-label="Next short"><ArrowDownIcon /></button>
      </div>

      <div ref={box} tabIndex={-1} data-lenis-prevent className="rail h-full snap-y snap-mandatory overflow-y-auto outline-none">
        {reels.map((r, i) => {
          const muse = museBySlug(r.muses[0]);
          const on = i === active;
          return (
            <section key={r.slug} data-i={i} className="flex h-[100dvh] snap-start snap-always items-center justify-center py-4 md:py-8">
              <div className="media relative aspect-[9/16] h-full max-h-full max-w-full" data-playing={on} data-revealed="true">
                <div className="art">
                  <ArtFrame {...r} seed={r.slug} alt={r.title} autoPlay={on} key={on ? "on" : "off"} />
                </div>
                <div className="leak" />
                <div className="scrim-b absolute inset-0 z-[3]" />
                <div className="absolute inset-x-3 top-3 z-10 h-[3px] overflow-hidden rounded bg-ivory/20">
                  {on && <div key={r.slug} className="h-full origin-left bg-ivory" style={{ animation: `progress ${r.seconds}s linear forwards` }} />}
                </div>
                <div className="absolute bottom-0 left-0 right-16 z-10 p-4">
                  <span className="pill pill-wine mb-3">AI-generated</span>
                  <p className="font-display text-3xl italic leading-tight">{r.title}</p>
                  {muse && (
                    <Link href={`/muse/${muse.slug}`} onClick={onClose} className="mt-1 inline-block text-sm text-parchment underline-offset-4 hover:underline">
                      with {muse.name}
                    </Link>
                  )}
                  <Link href={`/watch/${r.slug}`} onClick={onClose} className="mt-3 block text-xs font-semibold uppercase tracking-[0.2em] text-brass">
                    Open full page →
                  </Link>
                </div>
                <div className="absolute bottom-4 right-3 z-10 flex flex-col gap-3">
                  <button className={iconBtn} onClick={() => setLiked((l) => ({ ...l, [r.slug]: !l[r.slug] }))} aria-pressed={!!liked[r.slug]} aria-label="Like">
                    <HeartIcon filled={!!liked[r.slug]} className={liked[r.slug] ? "text-wine-hot" : ""} />
                  </button>
                  <button className={iconBtn} onClick={() => navigator.clipboard?.writeText(`${location.origin}/watch/${r.slug}`)} aria-label="Copy link">
                    <ShareIcon />
                  </button>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
