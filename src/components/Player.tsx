"use client";

import { useEffect, useRef, useState } from "react";
import type { Reel } from "@/lib/data";
import ArtFrame from "./ArtFrame";
import Lightbox from "./Lightbox";

const toSec = (t: string) => t.split(":").reduce((a, n) => a * 60 + Number(n), 0);
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

// Placeholder player: simulates playback over the SVG art until real video is wired in.
export default function Player({ reel }: { reel: Reel }) {
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [theatre, setTheatre] = useState(false);
  const [box, setBox] = useState<number | null>(null);
  const bar = useRef<HTMLDivElement>(null);
  const short = reel.kind === "short";

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setT((v) => (v + 0.25 >= reel.seconds ? (setPlaying(false), reel.seconds) : v + 0.25)), 250);
    return () => clearInterval(id);
  }, [playing, reel.seconds]);

  const seek = (s: number) => {
    setT(Math.max(0, Math.min(reel.seconds, s)));
    setPlaying(true);
  };
  const current = [...reel.chapters].reverse().find((c) => toSec(c.t) <= t);

  // Placeholder stills: alternate crops of the hero scene with related scenes.
  const alt = ["linen", "curve", "wine"] as const;
  const stills = [0, 1, 2, 3, 4, 5].map((i) => ({
    scene: i % 2 ? alt[(i >> 1) % alt.length] : reel.scene,
    tone: reel.tone,
    seed: `${reel.slug}-still-${i}`,
    title: `${reel.title} — still ${i + 1}`,
    caption: reel.chapters[i % reel.chapters.length].label,
  }));

  return (
    <>
      <div className={`${theatre ? "" : "gutter"} transition-all duration-700`}>
        <div className={`media mx-auto ${short ? "aspect-[9/16] max-h-[82vh]" : `aspect-video ${theatre ? "!rounded-none" : ""}`}`} data-playing={playing} data-revealed="true">
          <div className="art">
            <ArtFrame {...reel} seed={reel.slug} alt={reel.title} />
          </div>
          <div className="leak" />
          <button className="absolute inset-0 z-10 flex items-center justify-center" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause" : "Play"} data-cursor={playing ? "Pause" : "Play"}>
            {!playing && <span className="flex h-20 w-20 items-center justify-center rounded-full border border-brass/60 bg-forest/60 text-3xl text-ivory backdrop-blur md:h-24 md:w-24">▶</span>}
          </button>
          <span className="pill pill-ghost absolute left-3 top-3 z-20">AI-generated</span>
          {current && <span className="pill pill-ghost absolute right-3 top-3 z-20">{current.label}</span>}
          <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-10">
            <div
              ref={bar}
              className="group relative h-4 cursor-pointer"
              onClick={(e) => {
                const r = bar.current!.getBoundingClientRect();
                seek(((e.clientX - r.left) / r.width) * reel.seconds);
              }}
              role="slider"
              aria-label="Seek"
              aria-valuemin={0}
              aria-valuemax={reel.seconds}
              aria-valuenow={Math.round(t)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") seek(t + 5);
                if (e.key === "ArrowLeft") seek(t - 5);
              }}
            >
              <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 bg-ivory/25" />
              <div className="absolute left-0 top-1/2 h-[3px] -translate-y-1/2 bg-brass" style={{ width: `${(t / reel.seconds) * 100}%` }} />
              {reel.chapters.map((c) => (
                <span key={c.t} className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-ivory/60" style={{ left: `${(toSec(c.t) / reel.seconds) * 100}%` }} />
              ))}
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-ivory/85">
              <div className="flex items-center gap-4">
                <button onClick={() => setPlaying((p) => !p)} className="text-base" aria-label={playing ? "Pause" : "Play"}>{playing ? "❚❚" : "▶"}</button>
                <span className="tabular-nums">{fmt(t)} / {fmt(reel.seconds)}</span>
              </div>
              {!short && (
                <button onClick={() => setTheatre((v) => !v)} className="uppercase tracking-[0.2em] hover:text-brass" aria-pressed={theatre}>
                  {theatre ? "Exit theatre" : "Theatre"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <section className="gutter mt-12" aria-labelledby="chapters">
        <h2 id="chapters" className="label mb-4">Chapters</h2>
        <div className="rail flex gap-2 overflow-x-auto pb-2">
          {reel.chapters.map((c) => {
            const on = current?.t === c.t;
            return (
              <button key={c.t} onClick={() => seek(toSec(c.t))} className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${on ? "border-brass bg-brass text-forest" : "border-ivory/15 bg-bottle hover:border-brass"}`}>
                <span className={`mr-2 tabular-nums ${on ? "" : "text-parchment/60"}`}>{c.t}</span>
                {c.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-10" aria-label="Stills">
        <div className="gutter rail flex gap-3 overflow-x-auto pb-2">
          {stills.map((s, i) => (
            <button key={s.seed} className="media group aspect-[4/3] w-[62vw] shrink-0 sm:w-[34vw] lg:w-[19vw]" onClick={() => setBox(i)} data-cursor="View" data-revealed="true" aria-label={`Open ${s.title}`}>
              <div className="art group-hover:scale-105">
                <ArtFrame {...s} alt={s.title} className={i % 2 ? "" : ["scale-[1.6] origin-top-left", "scale-[1.9] origin-bottom", "scale-[1.4] origin-right"][(i >> 1) % 3]} />
              </div>
            </button>
          ))}
        </div>
      </section>
      {box !== null && <Lightbox items={stills} index={box} onClose={() => setBox(null)} />}
    </>
  );
}
