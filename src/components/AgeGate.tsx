"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { lockScroll } from "./SmoothScroll";

// Corner flourish for the gilded frame; mirrored per corner with transforms.
const Corner = ({ className }: { className: string }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1" className={`absolute text-brass ${className}`} aria-hidden>
    <path d="M1 21V1h20" />
    <path d="M5 17V5h12" />
  </svg>
);

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

  const pillBase = "flex h-[52px] items-center justify-center rounded-full px-8 font-ui text-base font-bold uppercase tracking-[0.16em] transition md:h-14";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="age-gate fixed inset-0 z-[95] flex items-end justify-center overflow-hidden bg-[#07100b] px-4 pb-7 md:items-center md:pb-0"
          exit={{ opacity: 0, filter: "blur(12px)" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="age-title"
        >
          {/* Oil-painted Tuscan interior, tinted green and vignetted so the card reads */}
          <picture>
            <source media="(max-width: 767px)" srcSet="/art/villa-dusk-sm.webp" />
            <img
              src="/art/villa-dusk.webp"
              alt=""
              className="absolute inset-0 h-full w-full scale-[1.04] object-cover object-[30%_50%] contrast-[1.05] saturate-[0.85] md:object-[50%_45%]"
            />
          </picture>
          <div className="absolute inset-0 bg-[#0b2418] opacity-55 mix-blend-color" />
          <div className="absolute inset-0 hidden bg-[radial-gradient(ellipse_58%_70%_at_50%_50%,rgba(7,16,11,0.25)_0%,rgba(7,16,11,0.72)_62%,rgba(4,9,6,0.94)_100%)] md:block" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,9,6,0.6)_0%,rgba(4,9,6,0.1)_26%,rgba(7,16,11,0.55)_48%,rgba(4,9,6,0.96)_78%)] md:bg-[linear-gradient(180deg,rgba(4,9,6,0.55)_0%,transparent_22%,transparent_70%,rgba(4,9,6,0.7)_100%)]" />

          <div className="absolute inset-x-5 top-6 flex items-center justify-between md:inset-x-16 md:top-11">
            <div className="flex items-baseline gap-2.5">
              <span className="font-bodoni text-xl font-black tracking-tight md:text-[26px]">LUST</span>
              <span className="font-script text-[22px] text-brass md:text-[28px]">Photography</span>
            </div>
            <span className="hidden font-ui text-[13px] font-semibold uppercase tracking-[0.32em] text-ivory/60 md:block">Toscana · MMXXVI</span>
          </div>

          <div className="relative w-full max-w-[600px] border border-brass/55 bg-[rgba(8,20,13,0.34)] p-1.5 shadow-[0_60px_140px_-30px_rgba(0,0,0,0.85)] backdrop-blur-[14px] md:p-2.5">
            <div className="relative flex flex-col items-center border border-brass/35 bg-[linear-gradient(180deg,rgba(14,34,24,0.9)_0%,rgba(9,22,15,0.94)_100%)] px-6 pb-7 pt-9 text-center md:px-[72px] md:pb-14 md:pt-16">
              <Corner className="left-2.5 top-2.5 hidden md:block" />
              <Corner className="right-2.5 top-2.5 hidden -scale-x-100 md:block" />
              <Corner className="bottom-2.5 left-2.5 hidden -scale-y-100 md:block" />
              <Corner className="bottom-2.5 right-2.5 hidden -scale-100 md:block" />

              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-brass/70 shadow-[inset_0_0_0_4px_#0a1810,inset_0_0_0_5px_rgba(201,163,106,0.35)] md:h-[92px] md:w-[92px] md:shadow-[inset_0_0_0_6px_#09160f,inset_0_0_0_7px_rgba(201,163,106,0.35)]">
                <span className="font-bodoni text-[26px] font-bold tracking-tight text-[#d8b77e] md:text-[38px]">LP</span>
              </div>

              <div className="mt-5 flex items-center gap-3.5 md:mt-7">
                <span className="hidden h-px w-10 bg-brass/60 md:block" />
                <span className="font-ui text-xs font-bold uppercase tracking-[0.32em] text-brass md:text-sm">Riservato agli adulti</span>
                <span className="hidden h-px w-10 bg-brass/60 md:block" />
              </div>

              <h1 id="age-title" className="mt-3.5 text-balance font-hero text-[38px] leading-[1.04] md:mt-5 md:text-[58px] md:leading-[1.02]">
                An evening for <em className="text-[#d8b77e]">adults</em> only
              </h1>

              <p className="mt-3.5 max-w-[400px] text-pretty text-sm leading-relaxed text-ivory/80 md:mt-5 md:text-base">
                Sensual, AI-imagined reels and stills. By entering you confirm you are 18 or older and of legal age where you live, and accept our Terms.
              </p>

              <div className="mt-6 flex w-full flex-col gap-2.5 md:mt-9 md:w-auto md:flex-row md:gap-3.5">
                <button
                  className={`${pillBase} bg-[linear-gradient(180deg,#b0493b_0%,#8e3327_100%)] text-[#f7efe1] shadow-[0_0_0_1px_rgba(201,163,106,0.5),0_14px_40px_-12px_rgba(158,59,46,0.9)] hover:brightness-110`}
                  onClick={enter}
                  autoFocus
                >
                  I am 18+ · Enter
                </button>
                <a className={`${pillBase} border border-ivory/35 text-ivory/85 hover:border-brass hover:text-brass`} href="https://www.google.com" rel="noreferrer">
                  Leave
                </a>
              </div>

              <p className="mt-5 font-script text-2xl text-[#d8b77e]/85 md:mt-8 md:text-[30px]">La Dolce Lussuria</p>
            </div>
          </div>

          <div className="absolute inset-x-16 bottom-9 hidden items-center justify-between font-ui text-xs font-semibold uppercase tracking-[0.28em] text-ivory/50 md:flex">
            <span>All characters are fictional adults, created with AI</span>
            <span>Terms · Privacy · Compliance</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
