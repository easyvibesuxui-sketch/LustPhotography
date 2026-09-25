"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    (window as unknown as { lenis?: Lenis }).lenis = lenis;
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    // Anchor links go through Lenis so they glide instead of jumping.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="/#"], a[href^="#"]');
      if (!a) return;
      const hash = a.getAttribute("href")!.replace(/^\//, "");
      const el = document.querySelector(hash);
      if (el && location.pathname === "/") {
        e.preventDefault();
        lenis.scrollTo(el as HTMLElement, { offset: -70 });
        history.replaceState(null, "", hash);
      }
    };
    document.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, []);
  return null;
}

export function lockScroll(lock: boolean) {
  const lenis = (window as unknown as { lenis?: Lenis }).lenis;
  if (lock) lenis?.stop();
  else lenis?.start();
  document.documentElement.style.overflow = lock ? "hidden" : "";
}
