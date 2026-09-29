"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { categoryBySlug, museBySlug, visibleArt, type Reel } from "@/lib/data";
import { useMe } from "@/lib/auth";
import { LockPill } from "./Lock";
import ArtFrame from "./ArtFrame";
import PosterTitle from "./PosterTitle";

type Props = { reel: Reel; variant?: "film" | "short"; onOpen?: () => void; className?: string };

export function useVeilReveal() {
  const [revealed, setRevealed] = useState(false);
  // Returns true if this click was consumed to lift the veil.
  const consume = () => {
    if (!revealed && document.documentElement.dataset.veil === "on") {
      setRevealed(true);
      return true;
    }
    return false;
  };
  return { revealed, consume };
}

export default function ReelCard({ reel, variant = reel.kind, onOpen, className = "" }: Props) {
  const [playing, setPlaying] = useState(false);
  const [menu, setMenu] = useState(false);
  const [saved, setSaved] = useState(false);
  const [tip, setTip] = useState<{ x: number; y: number } | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const video = useRef<HTMLDivElement>(null);
  const { revealed, consume } = useVeilReveal();
  const { me } = useMe();
  // Locked reels show their poster (or its blur); the video itself is gated server-side.
  const art = visibleArt(reel, me?.tier);
  const locked = art.locked;

  const start = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setPlaying(true), 250);
  };
  const stop = () => {
    window.clearTimeout(timer.current);
    setPlaying(false);
    setMenu(false);
    setTip(null);
  };

  useEffect(() => {
    const v = video.current?.querySelector("video");
    if (!v) return;
    if (playing) v.play().catch(() => {});
    else {
      v.pause();
      v.currentTime = 0;
    }
  }, [playing]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const short = variant === "short";
  const onActivate = (e: React.MouseEvent) => {
    if (consume()) {
      e.preventDefault();
      return;
    }
    if (onOpen) {
      e.preventDefault();
      onOpen();
    }
  };

  // Long-press previews on touch screens.
  const onTouchStart = () => {
    timer.current = window.setTimeout(() => setPlaying(true), 380);
  };

  return (
    <div
      className={`media group shrink-0 snap-start transition-transform duration-700 ease-[var(--ease-film)] hover:z-10 ${short ? "hover:scale-[1.04]" : "hover:scale-[1.015]"} ${short ? "aspect-[9/16]" : "aspect-video"} ${className}`}
      data-playing={playing}
      data-revealed={revealed}
      onPointerEnter={(e) => e.pointerType === "mouse" && start()}
      onPointerLeave={stop}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        setTip({ x: e.clientX - r.left, y: e.clientY - r.top });
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={() => window.clearTimeout(timer.current)}
      onFocus={start}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && stop()}
    >
      <div ref={video} className="art">
        <ArtFrame {...art} seed={reel.slug} alt={reel.title} />
      </div>
      <div className="leak" />
      <div className={`absolute inset-0 z-[3] transition-colors duration-500 ${playing ? "bg-black/10" : "bg-black/0"}`} />
      <div className={`${short ? "scrim-b" : "scrim-poster"} absolute inset-0 z-[3]`} />

      {/* Top bar: badges at rest, rating + duration + menu while playing */}
      <div className={`absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-2 ${short ? "p-2.5 md:p-3" : "p-3.5 md:p-5"}`}>
        <div className="flex flex-wrap gap-1.5">
          {playing ? (
            <>
              <span className="pill pill-NEW">★ {reel.rating.toFixed(1)}</span>
              <span className="pill pill-ghost">{reel.duration}</span>
              {locked && reel.tier && <LockPill need={reel.tier} />}
            </>
          ) : short ? (
            <>
              <span className="pill pill-wine">
                <span className="font-bodoni text-[0.85rem] font-bold normal-case tracking-tight">LP</span>Shorts
              </span>
              {locked && reel.tier && <LockPill need={reel.tier} />}
            </>
          ) : (
            <>
              {/* One badge at rest keeps the poster quiet */}
              {reel.badges.slice(0, 1).map((b) => (
                <span key={b} className={`pill pill-${b}`}>
                  {b}
                </span>
              ))}
              {locked && reel.tier && <LockPill need={reel.tier} />}
            </>
          )}
        </div>
        <div className="relative">
          <button
            className={`flex h-8 w-8 items-center justify-center rounded-full bg-forest/70 text-lg leading-none text-ivory backdrop-blur transition-opacity hover:bg-brass hover:text-forest ${playing || menu ? "opacity-100" : "opacity-0 focus:opacity-100 [@media(hover:none)]:opacity-100"}`}
            aria-label={`More options for ${reel.title}`}
            aria-expanded={menu}
            onClick={() => setMenu((m) => !m)}
          >
            ⋯
          </button>
          {menu && (
            <div className="absolute right-0 top-10 w-44 overflow-hidden rounded-md border border-brass/30 bg-bottle/95 text-sm shadow-2xl backdrop-blur" role="menu">
              {[
                [saved ? "Saved" : "Save to list", () => setSaved((s) => !s)],
                ["Share", () => navigator.clipboard?.writeText(`${location.origin}/watch/${reel.slug}`)],
                ["Not interested", () => setMenu(false)],
              ].map(([label, fn]) => (
                <button key={label as string} role="menuitem" className="block w-full px-4 py-2.5 text-left text-ivory/90 hover:bg-moss/60" onClick={fn as () => void}>
                  {label as string}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <div className={`pointer-events-none absolute inset-x-0 bottom-0 z-[6] ${short ? "p-3 md:p-4" : "p-4 md:p-6"}`}>
        {short ? (
          <p className="font-sans text-base font-bold leading-snug md:text-lg">{reel.title}</p>
        ) : (
          <PosterTitle title={reel.title} lockup={reel.lockup} />
        )}
      </div>

      {/* Progress bar */}
      <div className="absolute inset-x-0 bottom-0 z-[7] h-[3px] bg-ivory/10">
        {playing && <div className="h-full origin-left bg-brass" style={{ animation: `progress ${Math.min(reel.seconds, 40)}s linear forwards` }} />}
      </div>

      <div className="veil-note absolute inset-0 z-[8] items-center justify-center">
        <span className="pill pill-ghost">Click to reveal</span>
      </div>

      {/* Cursor-following title tooltip */}
      {playing && tip && (
        <span className="pointer-events-none absolute z-30 hidden whitespace-nowrap rounded-sm bg-ivory px-2 py-1 text-[0.7rem] font-semibold text-forest shadow-lg md:block" style={{ left: tip.x + 18, top: tip.y + 18 }}>
          {reel.title} · {reel.duration}
        </span>
      )}

      <Link
        href={`/watch/${reel.slug}`}
        onClick={onActivate}
        className="absolute inset-0 z-[9]"
        aria-label={`${short ? "Play short" : "Watch"}: ${reel.title}`}
        data-cursor="Play"
      />
    </div>
  );
}

// A film poster with a quiet caption underneath, for roomy grids.
export function FilmTile({ reel }: { reel: Reel }) {
  const meta = [categoryBySlug(reel.category)?.title, reel.muses.map((m) => museBySlug(m)?.name).filter(Boolean)[0]].filter(Boolean).join(" · ");
  return (
    <figure className="flex flex-col gap-4 md:gap-5">
      <ReelCard reel={reel} />
      <figcaption className="flex items-baseline justify-between gap-4 px-0.5">
        <span className="flex min-w-0 flex-col gap-1">
          <span className="truncate text-lg font-semibold text-ivory">{reel.title}</span>
          {meta && <span className="truncate text-[0.95rem] text-parchment/65">{meta}</span>}
        </span>
        <span className="shrink-0 font-ui text-[0.95rem] tracking-[0.08em] text-parchment/65">{reel.duration}</span>
      </figcaption>
    </figure>
  );
}
