"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Art } from "@/lib/data";
import ArtFrame from "./ArtFrame";
import { lockScroll } from "./SmoothScroll";
import { CloseIcon } from "./Icons";

export type LightItem = Art & { seed: string; title: string; caption?: string };

export default function Lightbox({ items, index, onClose }: { items: LightItem[]; index: number; onClose: () => void }) {
  const [i, setI] = useState(index);
  const go = (d: number) => setI((v) => (v + d + items.length) % items.length);

  useEffect(() => {
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lockScroll(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const item = items[i];
  const nav = "absolute top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-brass/40 bg-forest/70 text-2xl text-ivory backdrop-blur hover:bg-brass hover:text-forest";
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#050907]/95 p-4 backdrop-blur-md md:p-12" role="dialog" aria-modal="true" aria-label={item.title} onClick={onClose}>
      <button className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-brass/40 text-xl hover:bg-brass hover:text-forest" onClick={onClose} aria-label="Close">
        <CloseIcon />
      </button>
      <button className={`${nav} left-3 md:left-8`} onClick={(e) => (e.stopPropagation(), go(-1))} aria-label="Previous image">‹</button>
      <button className={`${nav} right-3 md:right-8`} onClick={(e) => (e.stopPropagation(), go(1))} aria-label="Next image">›</button>
      <AnimatePresence mode="wait">
        <motion.figure
          key={item.seed}
          className="flex max-h-full w-full max-w-5xl flex-col items-center"
          initial={{ opacity: 0, filter: "blur(18px)", scale: 0.98 }}
          animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="media aspect-[4/5] max-h-[78vh] w-auto max-w-full md:aspect-[3/2]" data-revealed="true" style={{ height: "78vh" }}>
            <div className="art">
              <ArtFrame {...item} alt={item.title} />
            </div>
          </div>
          <figcaption className="mt-4 text-center">
            <p className="font-display text-2xl italic">{item.title}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-parchment/70">
              {item.caption} · {i + 1} / {items.length} · AI-generated
            </p>
          </figcaption>
        </motion.figure>
      </AnimatePresence>
    </div>
  );
}
