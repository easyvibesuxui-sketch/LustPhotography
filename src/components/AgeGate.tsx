"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import ArtFrame from "./ArtFrame";
import { lockScroll } from "./SmoothScroll";

export default function AgeGate() {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (document.documentElement.dataset.age === "ok") setOpen(false);
    else lockScroll(true);
  }, []);

  const enter = () => {
    try {
      localStorage.setItem("lp-age", "ok");
    } catch {}
    document.documentElement.dataset.age = "ok";
    lockScroll(false);
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="age-gate fixed inset-0 z-[95] flex items-center justify-center overflow-hidden"
          exit={{ opacity: 0, filter: "blur(12px)" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="age-title"
        >
          <div className="absolute inset-0 scale-110 blur-2xl">
            <ArtFrame scene="villa" tone="terracotta" seed="gate" />
          </div>
          <div className="absolute inset-0 bg-forest/75" />
          <div className="relative mx-4 max-w-lg rounded-md border border-brass/40 bg-forest/70 px-8 py-12 text-center shadow-2xl backdrop-blur-md md:px-14">
            <p className="font-bodoni text-5xl font-black tracking-tight text-brass">LP</p>
            <div className="hairline mx-auto my-6 w-40" />
            <p className="label">Lust Photography</p>
            <h1 id="age-title" className="mt-4 font-display text-4xl font-light leading-tight md:text-5xl">
              You must be <em className="text-brass">18+</em> to enter
            </h1>
            <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-parchment/80">
              This website contains sensual, AI-generated content intended for adults only. By entering you confirm you are of legal age in your country and agree to our Terms.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <button className="btn btn-wine" onClick={enter} autoFocus>
                I am 18+ · Enter
              </button>
              <a className="btn btn-brass" href="https://www.google.com" rel="noreferrer">
                Leave
              </a>
            </div>
            <p className="mt-8 font-script text-2xl text-parchment/70">La Dolce Lussuria</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
