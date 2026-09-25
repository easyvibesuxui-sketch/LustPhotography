"use client";

import { useState } from "react";
import Link from "next/link";
import { museBySlug, visibleArt, type Still } from "@/lib/data";
import { useMe } from "@/lib/auth";
import { LockPill } from "./Lock";
import ArtFrame from "./ArtFrame";
import Lightbox from "./Lightbox";
import Reveal from "./Reveal";

const ratio = { portrait: "aspect-[4/5]", landscape: "aspect-[3/2]", square: "aspect-square" };

type View = Still & { locked: boolean };

function StillTile({ s, onOpen }: { s: View; onOpen: () => void }) {
  const [revealed, setRevealed] = useState(false);
  const muse = museBySlug(s.muse);
  if (s.locked) {
    // Blurred teaser only; the full image is gated server-side.
    return (
      <Link href="/pricing/" className={`media group block w-full ${ratio[s.ratio]}`} data-revealed="true" data-cursor="Unlock" aria-label={`Unlock image: ${s.title}`}>
        <div className="art scale-110 blur-md">
          <ArtFrame {...s} seed={s.slug} alt="" />
        </div>
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-forest/30 text-center">
          {s.tier && <LockPill need={s.tier} />}
          <p className="font-display text-lg italic text-ivory/90">{s.title}</p>
        </div>
      </Link>
    );
  }
  return (
    <button
      className={`media group block w-full text-left ${ratio[s.ratio]}`}
      data-revealed={revealed}
      data-cursor="View"
      onClick={() => {
        if (!revealed && document.documentElement.dataset.veil === "on") return setRevealed(true);
        onOpen();
      }}
      aria-label={`Open image: ${s.title}`}
    >
      <div className="art sepia-[0.55] saturate-[0.8] group-hover:scale-105 group-hover:sepia-0 group-hover:saturate-100">
        <ArtFrame {...s} seed={s.slug} alt={s.title} />
      </div>
      <div className="absolute left-3 top-3 z-10 flex gap-1.5">
        {s.badges.map((b) => (
          <span key={b} className={`pill pill-${b}`}>{b}</span>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 z-10 translate-y-3 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
        <p className="font-display text-xl italic">{s.title}</p>
        {muse && <p className="text-xs uppercase tracking-[0.18em] text-parchment/80">{muse.name}</p>}
        {s.tags.length > 0 && <p className="mt-1.5 text-xs text-brass">{s.tags.filter((t) => t !== "Nipslip").map((t) => `#${t}`).join("  ")}</p>}
      </div>
      <div className="veil-note absolute inset-0 z-[8] items-center justify-center">
        <span className="pill pill-ghost">Click to reveal</span>
      </div>
    </button>
  );
}

export default function StillsGrid({ stills }: { stills: Still[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const { me } = useMe();
  const views = stills.map((s) => visibleArt(s, me?.tier));
  // Lightbox walks only what this viewer may see.
  const open_ = views.filter((v) => !v.locked);
  const items = open_.map((s) => ({ ...s, seed: s.slug, caption: museBySlug(s.muse)?.name }));
  return (
    <>
      <div className="gutter columns-2 gap-3 md:columns-3 md:gap-4 xl:columns-4">
        {views.map((s, i) => (
          <Reveal key={s.slug} delay={(i % 4) * 0.08} className="mb-3 break-inside-avoid md:mb-4">
            <StillTile s={s} onOpen={() => setOpen(open_.indexOf(s))} />
          </Reveal>
        ))}
      </div>
      {open !== null && <Lightbox items={items} index={open} onClose={() => setOpen(null)} />}
    </>
  );
}
