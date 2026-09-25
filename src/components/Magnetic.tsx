"use client";

import { useRef } from "react";

// Pulls its child slightly toward the pointer.
export default function Magnetic({ children, strength = 0.3, className }: { children: React.ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) * strength;
    const dy = (e.clientY - (r.top + r.height / 2)) * strength;
    ref.current.style.transform = `translate(${dx}px, ${dy}px)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  return (
    <span ref={ref} className={`inline-block transition-transform duration-500 ease-[var(--ease-film)] ${className ?? ""}`} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </span>
  );
}
