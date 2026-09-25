"use client";

import { useRef, useState, useEffect } from "react";

// Horizontal carousel: native scroll + snap, mouse drag with momentum, arrow buttons.
export default function Rail({ children, className = "", label }: { children: React.ReactNode; className?: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const drag = useRef({ down: false, x: 0, left: 0, moved: 0, v: 0, last: 0, raf: 0 });

  const update = () => {
    const el = ref.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  };

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const by = (dir: number) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" });

  const onDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    cancelAnimationFrame(drag.current.raf);
    drag.current = { ...drag.current, down: true, x: e.clientX, left: ref.current.scrollLeft, moved: 0, v: 0, last: e.clientX };
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.down || !ref.current) return;
    const dx = e.clientX - d.x;
    d.moved = Math.max(d.moved, Math.abs(dx));
    if (d.moved > 4) {
      ref.current.style.scrollSnapType = "none";
      ref.current.scrollLeft = d.left - dx;
    }
    d.v = e.clientX - d.last;
    d.last = e.clientX;
  };
  const onUp = () => {
    const d = drag.current;
    if (!d.down) return;
    d.down = false;
    const el = ref.current;
    if (!el) return;
    let v = -d.v * 1.6;
    const glide = () => {
      el.scrollLeft += v;
      v *= 0.93;
      if (Math.abs(v) > 0.5) d.raf = requestAnimationFrame(glide);
      else el.style.scrollSnapType = "";
    };
    d.raf = requestAnimationFrame(glide);
  };
  // Swallow the click that ends a drag so cards don't open.
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved > 6) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = 0;
    }
  };

  const arrow = "absolute top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-brass/50 bg-forest/80 text-ivory backdrop-blur transition hover:bg-brass hover:text-forest disabled:pointer-events-none disabled:opacity-0 md:flex";

  return (
    <div className="relative" role="region" aria-label={label}>
      <button className={`${arrow} left-3`} onClick={() => by(-1)} disabled={edge.start} aria-label="Previous">‹</button>
      <div
        ref={ref}
        onScroll={update}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        onClickCapture={onClickCapture}
        className={`rail gutter flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-[var(--gutter)] py-5 md:gap-4 ${className}`}
        data-cursor-rail
      >
        {children}
      </div>
      <button className={`${arrow} right-3`} onClick={() => by(1)} disabled={edge.end} aria-label="Next">›</button>
    </div>
  );
}
