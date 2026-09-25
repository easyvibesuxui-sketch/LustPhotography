"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import ArtFrame from "./ArtFrame";
import Magnetic from "./Magnetic";
import { SplitText } from "./Reveal";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1.3]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative flex h-[100svh] min-h-[620px] items-end overflow-hidden" aria-label="Featured">
      <motion.div className="absolute inset-0" style={reduce ? undefined : { scale, y }}>
        <div className="h-full w-full animate-[kenburns_24s_ease-in-out_infinite_alternate] motion-reduce:animate-none">
          <ArtFrame scene="cypress" tone="terracotta" seed="hero" alt="Cypress trees at golden hour" />
        </div>
      </motion.div>
      <div className="leak !opacity-100 [animation:leak_9s_ease-in-out_infinite]" />
      <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/30 to-black/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.55))]" />

      {/* Letterbox bars */}
      <motion.div className="absolute inset-x-0 top-0 z-10 bg-black" initial={{ height: "50%" }} animate={{ height: "5vh" }} transition={{ duration: 1.6, ease }} />
      <motion.div className="absolute inset-x-0 bottom-0 z-10 bg-black" initial={{ height: "50%" }} animate={{ height: "5vh" }} transition={{ duration: 1.6, ease }} />

      <motion.div className="gutter relative z-20 w-full pb-[12vh]" style={reduce ? undefined : { y: textY, opacity: fade }}>
        <motion.p className="label mb-5 flex items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 1 }}>
          <span className="h-px w-10 bg-brass" /> AI reels & images · Est. 2026 · Toscana
        </motion.p>
        <h1 className="font-hero leading-[0.88] tracking-[-0.02em]" style={{ fontSize: "clamp(3.6rem, 11vw, 12rem)" }}>
          <SplitText text="La Dolce" delay={0.9} />
          <br />
          <SplitText text="Lussuria" delay={1.15} className="italic text-brass" />
        </h1>
        <motion.p className="mt-4 font-script text-3xl text-parchment md:text-5xl" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8, duration: 1.2, ease }}>
          Desire, shot on film. Imagined by AI.
        </motion.p>
        <motion.div className="mt-9 flex flex-wrap items-center gap-3 md:gap-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.1, duration: 1, ease }}>
          <Magnetic>
            <Link href="/#shorts" className="btn btn-wine">▶ Watch Shorts</Link>
          </Magnetic>
          <Magnetic>
            <Link href="/#creators" className="btn btn-brass">Build my site</Link>
          </Magnetic>
          <Link href="/watch/villa-segreta" className="group ml-1 hidden items-center gap-3 text-sm text-parchment md:flex">
            <span className="pill pill-TRENDING">Now showing</span>
            <span className="font-display text-xl italic text-ivory group-hover:text-brass">Villa Segreta</span>
            <span className="text-xs text-parchment/70">12 min</span>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div className="absolute bottom-[7vh] right-[var(--gutter)] z-20 hidden flex-col items-center gap-3 md:flex" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.6 }}>
        <span className="label [writing-mode:vertical-rl]">Scroll</span>
        <span className="relative h-16 w-px overflow-hidden bg-ivory/20">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2s_ease-in-out_infinite] bg-brass" />
        </span>
      </motion.div>
    </section>
  );
}
