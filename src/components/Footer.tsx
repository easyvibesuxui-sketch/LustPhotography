"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const slogan = "La Dolce Lussuria";

const groups: [string, [string, string][]][] = [
  ["This is Lust Photography", [["About", "/#creators"], ["Shorts", "/#shorts"], ["Images", "/#images"], ["Muses", "/#muses"], ["Journal", "/browse"], ["Affiliates", "/#creators"]]],
  ["FAQ, Contact & Legal", [["Contact", "/#creators"], ["Privacy Policy", "#"], ["Cookies Policy", "#"], ["Terms & Conditions", "#"], ["Billing Support", "#"], ["Compliance Statement", "#"], ["Complaints & Content Removal", "#"], ["Anti-Trafficking Statement", "#"]]],
];

const socials = [
  ["Instagram", "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm5 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm5.5-1.5h.01"],
  ["X", "M4 4l16 16M20 4 4 20"],
  ["Telegram", "M21 4 3 11l6 2 2 6 3-4 5 4 2-15ZM9 13l9-6"],
  ["Reddit", "M12 8c4.4 0 8 2.2 8 5s-3.6 5-8 5-8-2.2-8-5 3.6-5 8-5Zm0 0 1-4 4 1M9 13h.01M15 13h.01M9.5 15.5c1.5 1 3.5 1 5 0"],
];

function Slogan() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [mx, setMx] = useState<number | null>(null);
  const letters = [...slogan];
  return (
    <div
      ref={ref}
      className="gutter select-none overflow-hidden pb-6 pt-16 md:pt-24"
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        setMx((e.clientX - r.left) / r.width);
      }}
      onPointerLeave={() => setMx(null)}
      aria-label={slogan}
      data-cursor=""
    >
      <p className="whitespace-nowrap text-center font-display font-light leading-[0.9] tracking-[-0.03em] text-ivory" style={{ fontSize: "clamp(3rem, 12.4vw, 15rem)" }} aria-hidden>
        {letters.map((c, i) => {
          const pos = (i + 0.5) / letters.length;
          const lift = mx === null || reduce ? 0 : Math.max(0, 1 - Math.abs(pos - mx) * 6) * -0.08;
          return (
            <motion.span
              key={i}
              className={`char ${c === " " ? "w-[0.25em]" : ""} ${i >= 9 ? "italic text-brass" : ""}`}
              initial={reduce ? false : { y: "0.9em", opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-block transition-transform duration-500 ease-[var(--ease-film)]" style={{ transform: `translateY(${lift}em)` }}>
                {c === " " ? " " : c}
              </span>
            </motion.span>
          );
        })}
      </p>
    </div>
  );
}

export default function Footer() {
  const [agree, setAgree] = useState(false);
  const [sent, setSent] = useState(false);
  const [lang, setLang] = useState("EN");
  return (
    <footer className="relative mt-24 border-t border-brass/15 bg-[#0a130e]">
      <Slogan />
      <div className="gutter grid gap-12 pb-12 pt-6 lg:grid-cols-[1fr_1fr_minmax(280px,380px)]">
        {groups.map(([title, links]) => (
          <div key={title}>
            <p className="label pb-3">{title}</p>
            <div className="hairline mb-5" />
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-ivory/80">
              {links.map(([l, h]) => (
                <li key={l}>
                  <Link href={h} className="transition-colors hover:text-brass">{l}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <form
          className="rounded-md border border-brass/20 bg-bottle/40 p-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (agree) setSent(true);
          }}
        >
          <p className="font-display text-2xl leading-tight">
            Want free access?
            <br />
            <em className="text-brass">Create an account.</em>
          </p>
          {sent ? (
            <p className="mt-6 text-sm text-parchment">Grazie. Check your inbox for the key.</p>
          ) : (
            <>
              <label className="sr-only" htmlFor="footer-email">Email address</label>
              <input id="footer-email" type="email" required placeholder="Your email address" className="mt-5 w-full rounded-sm border border-ivory/20 bg-forest/80 px-4 py-3.5 text-sm placeholder:text-parchment/50 focus:border-brass focus:outline-none" />
              <label className="mt-3 flex items-center gap-2.5 text-xs text-parchment/80">
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="h-4 w-4 accent-[var(--color-brass)]" required />
                I accept the <a href="#" className="underline underline-offset-2">terms and conditions</a>.
              </label>
              <button className="btn btn-wine mt-5 w-full">Watch for free</button>
            </>
          )}
        </form>
      </div>
      <div className="gutter flex flex-col items-center justify-between gap-6 border-t border-brass/15 py-8 md:flex-row">
        <div className="flex gap-2">
          {socials.map(([name, d]) => (
            <a key={name} href="#" aria-label={name} className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory/15 text-ivory/80 transition hover:border-brass hover:text-brass">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d={d} />
              </svg>
            </a>
          ))}
        </div>
        <p className="text-center text-xs leading-relaxed text-parchment/60">
          © 2026 Lust Photography · 18+ only · All characters are AI-generated fictional adults.
        </p>
        <div className="flex gap-1 rounded-full border border-ivory/15 p-1" role="group" aria-label="Language">
          {["EN", "KA", "IT"].map((l) => (
            <button key={l} onClick={() => setLang(l)} aria-pressed={lang === l} className={`rounded-full px-3 py-1 text-[0.68rem] font-bold tracking-widest ${lang === l ? "bg-brass text-forest" : "text-parchment/70 hover:text-ivory"}`}>
              {l}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}
