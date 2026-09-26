"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { heroSlides } from "@/lib/data";
import ArtFrame from "./ArtFrame";
import Magnetic from "./Magnetic";
import { PlayIcon } from "./Icons";

const ease = [0.22, 1, 0.36, 1] as const;
// Used when a slide has no video (placeholder build) or motion is reduced.
const STILL_MS = 7000;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  // Slides whose video failed to load fall back to poster + timer instead of skipping instantly.
  const [failed, setFailed] = useState<Record<number, boolean>>({});
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const slide = heroSlides[i];
  // Exiting slides stay mounted during the crossfade; only the active one may drive state.
  const active = useRef(0);
  active.current = i;
  const go = useCallback((n: number) => {
    setProgress(0);
    setI((n + heroSlides.length) % heroSlides.length);
  }, []);
  const next = useCallback(() => go(i + 1), [go, i]);

  // Play the active reel once from the start; its end advances the carousel.
  useEffect(() => {
    const v = video.current;
    if (!v || reduce) return;
    // Autoplay can be blocked (low-power mode) and load errors can fire before hydration:
    // either way, fall back to the timer rather than stalling on this banner.
    if (v.error) return setFailed((f) => ({ ...f, [i]: true }));
    v.currentTime = 0;
    v.play().catch(() => setFailed((f) => ({ ...f, [i]: true })));
  }, [i, reduce]);

  const useVideo = !!slide.video && !reduce && !failed[i];

  // No playable video (placeholder build, load failure, reduced motion): advance on a timer.
  useEffect(() => {
    if (useVideo) return;
    if (paused) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = (t - start) / STILL_MS;
      setProgress(Math.min(p, 1));
      if (p >= 1) next();
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [useVideo, paused, next, i]);

  // Keyboard: ← → switch banners when the hero is focused.
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") go(i + 1);
    if (e.key === "ArrowLeft") go(i - 1);
  };

  const togglePause = () => {
    const v = video.current;
    setPaused((p) => {
      if (v) (p ? v.play().catch(() => {}) : v.pause());
      return !p;
    });
  };

  return (
    <section
      ref={ref}
      className="relative flex h-[100svh] min-h-[620px] items-end overflow-hidden bg-black"
      aria-roledescription="carousel"
      aria-label="Featured"
      tabIndex={-1}
      onKeyDown={onKey}
    >
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={i}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease }}
          style={reduce ? undefined : { y }}
          aria-roledescription="slide"
          aria-label={`${i + 1} of ${heroSlides.length}`}
        >
          {/* The reel, full-bleed; portrait reels are anchored high so faces stay in frame on wide screens */}
          <div className="absolute inset-0">
            {useVideo ? (
              <video
                ref={(el) => {
                  if (el) video.current = el;
                }}
                className="h-full w-full object-cover object-[50%_28%]"
                src={slide.video}
                poster={slide.poster}
                muted
                playsInline
                preload="auto"
                autoPlay={!reduce}
                data-idx={i}
                onTimeUpdate={(e) => {
                  const v = e.currentTarget;
                  if (Number(v.dataset.idx) === active.current && v.duration) setProgress(v.currentTime / v.duration);
                }}
                onEnded={(e) => Number(e.currentTarget.dataset.idx) === active.current && next()}
                onError={(e) => {
                  const k = Number(e.currentTarget.dataset.idx);
                  setFailed((f) => ({ ...f, [k]: true }));
                }}
                aria-label={slide.title.join(" ")}
              />
            ) : (
              <ArtFrame scene="cypress" tone="terracotta" seed={`hero-${i}`} src={slide.poster} alt="" />
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="leak !opacity-100 [animation:leak_9s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest via-forest/30 to-black/20" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.55))]" />

      {/* Letterbox bars */}
      <motion.div className="absolute inset-x-0 top-0 z-10 bg-black" initial={{ height: "50%" }} animate={{ height: "5vh" }} transition={{ duration: 1.6, ease }} />
      <motion.div className="absolute inset-x-0 bottom-0 z-10 bg-black" initial={{ height: "50%" }} animate={{ height: "5vh" }} transition={{ duration: 1.6, ease }} />

      <motion.div className="gutter relative z-20 w-full pb-[14vh] md:max-w-[62%]" style={reduce ? undefined : { y: textY, opacity: fade }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={i} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.8, ease }}>
            <p className="label mb-5 flex items-center gap-3">
              <span className="h-px w-10 bg-brass" /> {slide.eyebrow}
            </p>
            <h1 className="font-hero leading-[0.88] tracking-[-0.02em]" style={{ fontSize: "clamp(3.2rem, 9vw, 10rem)" }}>
              {slide.title[0]}
              <br />
              <span className="italic text-brass">{slide.title[1]}</span>
            </h1>
            <p className="mt-4 font-script text-3xl text-parchment md:text-4xl">{slide.sub}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3 md:gap-4">
              <Magnetic>
                <Link href={slide.cta.href} className="btn btn-wine">
                  <PlayIcon size={12} /> {slide.cta.label}
                </Link>
              </Magnetic>
              <Magnetic>
                <Link href={slide.alt.href} className="btn btn-brass">{slide.alt.label}</Link>
              </Magnetic>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Story-style progress: one bar per banner, the active one fills with its reel */}
        <div className="mt-10 flex max-w-md items-center gap-2">
          {heroSlides.map((s, k) => (
            <button
              key={k}
              onClick={() => go(k)}
              className="group relative h-6 flex-1"
              aria-label={`Show banner ${k + 1}: ${s.title.join(" ")}`}
              aria-current={k === i}
            >
              <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 overflow-hidden rounded bg-ivory/25 group-hover:bg-ivory/40">
                <span
                  className="absolute inset-y-0 left-0 bg-brass"
                  style={{ width: `${k < i ? 100 : k === i ? progress * 100 : 0}%` }}
                />
              </span>
            </button>
          ))}
          <button
            onClick={togglePause}
            className="ml-2 flex h-8 w-8 items-center justify-center rounded-full border border-ivory/25 text-ivory/80 hover:border-brass hover:text-brass"
            aria-label={paused ? "Play banners" : "Pause banners"}
          >
            {paused ? <PlayIcon size={10} /> : <span className="flex gap-[3px]"><span className="h-2.5 w-[2px] bg-current" /><span className="h-2.5 w-[2px] bg-current" /></span>}
          </button>
        </div>
      </motion.div>
    </section>
  );
}
