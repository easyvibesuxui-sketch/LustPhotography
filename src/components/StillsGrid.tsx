"use client";

import { useState } from "react";
import { museBySlug, type Still } from "@/lib/data";
import ArtFrame from "./ArtFrame";
import Lightbox from "./Lightbox";
import Reveal from "./Reveal";

const ratio = { portrait: "aspect-[4/5]", landscape: "aspect-[3/2]", square: "aspect-square" };

function StillTile({ s, onOpen }: { s: Still; onOpen: () => void }) {
  const [revealed, setRevealed] = useState(false);
  const muse = museBySlug(s.muse);
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
        {s.tags.length > 0 && <p className="mt-1.5 text-xs text-brass">{s.tags.map((t) => `#${t}`).join("  ")}</p>}
      </div>
      <div className="veil-note absolute inset-0 z-[8] items-center justify-center">
        <span className="pill pill-ghost">Click to reveal</span>
      </div>
    </button>
  );
}

export default function StillsGrid({ stills }: { stills: Still[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const items = stills.map((s) => ({ ...s, seed: s.slug, caption: museBySlug(s.muse)?.name }));
  return (
    <>
      <div className="gutter columns-2 gap-3 md:columns-3 md:gap-4 xl:columns-4">
        {stills.map((s, i) => (
          <Reveal key={s.slug} delay={(i % 4) * 0.08} className="mb-3 break-inside-avoid md:mb-4">
            <StillTile s={s} onOpen={() => setOpen(i)} />
          </Reveal>
        ))}
      </div>
      {open !== null && <Lightbox items={items} index={open} onClose={() => setOpen(null)} />}
    </>
  );
}
