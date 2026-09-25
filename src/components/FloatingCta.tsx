"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { openJoin } from "./Header";

export default function FloatingCta() {
  const path = usePathname();
  const [hidden, setHidden] = useState(false);

  // Step aside while the footer (which has its own sign-up form) is on screen.
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const io = new IntersectionObserver(([e]) => setHidden(e.isIntersecting), { rootMargin: "0px 0px -120px 0px" });
    io.observe(footer);
    return () => io.disconnect();
  }, [path]);

  if (path.startsWith("/watch")) return null;

  return (
    <button
      onClick={openJoin}
      className={`group fixed bottom-4 right-4 z-40 h-24 w-24 transition-all duration-500 md:bottom-7 md:right-7 md:h-28 md:w-28 ${hidden ? "pointer-events-none translate-y-6 scale-75 opacity-0" : ""}`}
      aria-label="Watch free — join the newsletter"
      data-cursor="Join"
      tabIndex={hidden ? -1 : 0}
    >
      <span className="absolute inset-0 rounded-full bg-wine shadow-[0_10px_50px_-8px_rgba(158,59,46,0.9)] transition-transform duration-500 group-hover:scale-105" />
      <svg viewBox="0 0 100 100" className="absolute inset-0 animate-[spin_16s_linear_infinite] motion-reduce:animate-none" aria-hidden>
        <defs>
          <path id="ring" d="M50 50 m-37 0 a37 37 0 1 1 74 0 a37 37 0 1 1 -74 0" />
        </defs>
        <text fill="#f1e8d6" fontSize="9" fontWeight="600" letterSpacing="0.74">
          <textPath href="#ring">WATCH FREE ✦ WATCH FREE ✦ WATCH FREE ✦</textPath>
        </text>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center pl-1 text-2xl text-ivory">▶</span>
    </button>
  );
}
