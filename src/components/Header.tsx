"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Magnetic from "./Magnetic";
import { useMe } from "@/lib/auth";

const nav = [
  ["Shorts", "/shorts/"],
  ["Images", "/images/"],
  ["Muses", "/#muses"],
  ["Collections", "/#collections"],
  ["Fantasies", "/#fantasies"],
  ["Membership", "/pricing/"],
  ["For Brands", "/#brands"],
  ["For Creators", "/#creators"],
];

export const openJoin = () => window.dispatchEvent(new Event("lp:join"));

export default function Header() {
  const [solid, setSolid] = useState(false);
  const [menu, setMenu] = useState(false);
  const [veil, setVeil] = useState(false);
  const { me } = useMe();

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    setVeil(document.documentElement.dataset.veil !== "off");
    return () => window.removeEventListener("scroll", on);
  }, []);

  const toggleVeil = () => {
    const next = !veil;
    setVeil(next);
    document.documentElement.dataset.veil = next ? "on" : "off";
    try {
      localStorage.setItem("lp-veil", next ? "on" : "off");
    } catch {}
  };

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${solid || menu ? "border-b border-brass/20 bg-bottle/90 backdrop-blur-md" : "bg-gradient-to-b from-black/50 to-transparent"}`}>
      <div className="gutter flex h-16 items-center justify-between gap-6 md:h-20">
        <Link href="/" className="group flex items-baseline gap-2" aria-label="Lust Photography — home">
          <span className="font-bodoni text-[1.35rem] font-black tracking-tight sm:text-2xl md:text-[1.7rem]">LUST</span>
          <span className="font-script text-xl text-brass transition-transform duration-500 group-hover:-rotate-3 sm:text-2xl md:text-3xl">Photography</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className="group relative text-[0.8rem] font-medium tracking-wide text-ivory/85 hover:text-ivory">
              {label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-brass transition-all duration-500 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={toggleVeil}
            aria-pressed={veil}
            className="hidden items-center gap-2 rounded-full border border-ivory/15 px-3 py-2 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-parchment hover:border-brass sm:flex"
            title="Blur media until clicked"
          >
            <span className={`h-2 w-2 rounded-full ${veil ? "bg-brass" : "bg-ivory/30"}`} />
            Veil
          </button>
          <Link href="/browse" aria-label="Search" className="flex h-10 w-10 items-center justify-center rounded-full text-ivory/85 hover:text-brass">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </Link>
          <div className="hidden sm:block">
            <Magnetic>
              <Link href="/account/" className="btn btn-wine !px-5 !py-2.5">
                {me ? "Account" : "Join"}
              </Link>
            </Magnetic>
          </div>
          <button className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden" onClick={() => setMenu((m) => !m)} aria-expanded={menu} aria-label="Menu">
            <span className={`block h-px w-6 bg-ivory transition ${menu ? "translate-y-[3.5px] rotate-45" : ""}`} />
            <span className={`block h-px w-6 bg-ivory transition ${menu ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {menu && (
        <nav className="gutter flex h-[calc(100dvh-4rem)] flex-col gap-1 pb-10 pt-6 lg:hidden" aria-label="Mobile">
          {nav.map(([label, href], i) => (
            <Link key={href} href={href} onClick={() => setMenu(false)} className="border-b border-brass/15 py-4 font-display text-4xl font-light italic" style={{ animation: `fadeUp .6s ${i * 0.05}s both` }}>
              {label}
            </Link>
          ))}
          <div className="mt-auto flex gap-3">
            <Link href="/account/" className="btn btn-wine flex-1" onClick={() => setMenu(false)}>{me ? "Account" : "Join free"}</Link>
            <button className="btn btn-brass" onClick={toggleVeil} aria-pressed={veil}>Veil {veil ? "on" : "off"}</button>
          </div>
        </nav>
      )}
    </header>
  );
}
