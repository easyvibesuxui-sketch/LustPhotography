"use client";

import { useEffect, useRef, useState } from "react";

// Brass ring that trails the pointer and grows with a label over media.
export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let x = -100, y = -100, cx = -100, cy = -100, raf = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      setOn(true);
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
      setLabel(t?.dataset.cursor ?? "");
    };
    const leave = () => setOn(false);
    const tick = () => {
      cx += (x - cx) * 0.18;
      cy += (y - cy) * 0.18;
      if (ring.current) ring.current.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);

  const big = label !== "";
  return (
    <div ref={ring} className="cursor pointer-events-none fixed left-0 top-0 z-[100]" style={{ opacity: on ? 1 : 0 }} aria-hidden>
      <div
        className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-brass text-[0.6rem] font-bold uppercase tracking-[0.2em] text-ivory transition-all duration-300 ease-[var(--ease-film)]"
        style={{
          width: big ? 78 : 26,
          height: big ? 78 : 26,
          background: big ? "rgba(158,59,46,0.85)" : "transparent",
          borderColor: big ? "transparent" : undefined,
          backdropFilter: big ? "blur(4px)" : undefined,
        }}
      >
        {big && label}
      </div>
    </div>
  );
}
