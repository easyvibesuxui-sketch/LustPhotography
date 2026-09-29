"use client";

import { useEffect, useRef, useState } from "react";

// Site-wide soundtrack (not tied to any video — the reels stay muted). Browsers
// only allow sound after a user gesture, so it starts on the age-gate "Enter"
// click (or a returning visitor's first tap) unless they turned it off before.
// It plays the song once; when it ends the toggle shows "off" and can replay it.
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
    if (a.ended) a.currentTime = 0;
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
      <audio ref={audio} src="/audio/la-dolce.mp3" preload="none" onEnded={() => setOn(false)} />
      <button
        onClick={toggle}
        onPointerDown={(e) => e.stopPropagation()}
        className={`flex h-10 min-w-10 items-center justify-center gap-2 rounded-full border px-3 text-[0.65rem] font-bold uppercase tracking-[0.18em] transition-colors hover:border-brass hover:text-brass ${on ? "border-brass/60 text-brass" : "border-ivory/15 text-parchment"}`}
        title={on ? "Music on" : "Music off"}
        aria-pressed={on}
        aria-label="Music"
      >
        {/* Speaker: sound waves while playing, a slash when muted */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor" fillOpacity={0.15} />
          {on ? (
            <>
              <path d="M16 9.5a3.5 3.5 0 0 1 0 5" className="origin-left animate-pulse" />
              <path d="M18.5 7a7 7 0 0 1 0 10" />
            </>
          ) : (
            <path d="m17 9 5 6m0-6-5 6" />
          )}
        </svg>
        <span className="hidden sm:inline">{on ? "Music" : "Muted"}</span>
      </button>
    </>
  );
}
