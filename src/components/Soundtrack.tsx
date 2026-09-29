"use client";

import { useEffect, useRef, useState } from "react";

// Site-wide soundtrack. Browsers only allow sound after a user gesture, so it
// starts on the age-gate "Enter" click (or a returning visitor's first tap),
// unless they turned it off before. The reels themselves stay muted.
const KEY = "lp-sound";
const VOLUME = 0.55;

export default function Soundtrack() {
  const audio = useRef<HTMLAudioElement>(null);
  const fade = useRef<number | undefined>(undefined);
  const [on, setOn] = useState(false);

  const ramp = (to: number, done?: () => void) => {
    const a = audio.current;
    if (!a) return;
    window.clearInterval(fade.current);
    fade.current = window.setInterval(() => {
      const next = a.volume + (to > a.volume ? 0.05 : -0.05);
      if (Math.abs(to - a.volume) <= 0.05) {
        a.volume = to;
        window.clearInterval(fade.current);
        done?.();
      } else a.volume = Math.min(1, Math.max(0, next));
    }, 60);
  };

  const play = () => {
    const a = audio.current;
    if (!a) return;
    a.volume = 0;
    a.play()
      .then(() => {
        setOn(true);
        ramp(VOLUME);
      })
      .catch(() => setOn(false));
  };

  const stop = () => {
    setOn(false);
    ramp(0, () => audio.current?.pause());
  };

  useEffect(() => {
    let off = false;
    try {
      off = localStorage.getItem(KEY) === "off";
    } catch {}
    if (off) return;
    const start = () => {
      window.removeEventListener("lp:enter", start);
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
      play();
    };
    window.addEventListener("lp:enter", start);
    // Returning visitors skip the gate: wait for their first interaction.
    if (document.documentElement.dataset.age === "ok") {
      window.addEventListener("pointerdown", start, { once: true });
      window.addEventListener("keydown", start, { once: true });
    }
    return () => {
      window.removeEventListener("lp:enter", start);
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
      window.clearInterval(fade.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = () => {
    try {
      localStorage.setItem(KEY, on ? "off" : "on");
    } catch {}
    if (on) stop();
    else play();
  };

  return (
    <>
      <audio ref={audio} src="/audio/la-dolce.mp3" loop preload="none" />
      <button
        onClick={toggle}
        onPointerDown={(e) => e.stopPropagation()}
        className="flex h-10 min-w-10 items-center justify-center gap-2 rounded-full border border-ivory/15 px-3 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-parchment transition-colors hover:border-brass hover:text-brass"
        title={on ? "Music on" : "Music off"}
        aria-pressed={on}
        aria-label={on ? "Turn music off" : "Turn music on"}
      >
        <span className="flex h-3.5 items-end gap-[3px]" aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="w-[2px] rounded-full bg-brass"
              style={on ? { height: "100%", transformOrigin: "bottom", animation: `eq 0.9s ${i * 0.15}s ease-in-out infinite alternate` } : { height: 3, opacity: 0.5 }}
            />
          ))}
        </span>
        <span className="hidden sm:inline">Music</span>
      </button>
    </>
  );
}
