"use client";

import { useState } from "react";
import { packages } from "@/lib/data";
import ArtFrame from "./ArtFrame";
import Rail from "./Rail";
import Reveal from "./Reveal";
import { post } from "@/lib/auth";

const steps = [
  ["01", "Consult", "A call about your brand, audience, platforms and what you earn from today."],
  ["02", "Design", "Moodboard, art direction and a clickable prototype in your aesthetic."],
  ["03", "Build", "Fast, secure build with age verification, paywall and content protection."],
  ["04", "Launch", "Go-live, analytics, SEO and hand-over — plus care if you want it."],
];

const portfolio = [
  { name: "Maison Noir", scene: "blinds", tone: "noir" },
  { name: "Riviera Rose", scene: "riviera", tone: "terracotta" },
  { name: "Atelier Silk", scene: "linen", tone: "sand" },
  { name: "Velvet Cellar", scene: "wine", tone: "wine" },
  { name: "Olive & Oak", scene: "cypress", tone: "olive" },
] as const;

const paper = "bg-[radial-gradient(ellipse_at_top,rgba(241,232,214,0.07),transparent_70%)]";

export default function Creators() {
  const [sent, setSent] = useState(false);
  return (
    <div>
      <div className="gutter grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
        <Reveal>
          <p className="label mb-4">For creators · Web studio</p>
          <h2 className="font-hero text-5xl leading-[0.95] md:text-7xl">
            We build websites for <em className="text-brass">erotic content creators.</em>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="leading-relaxed text-parchment/80">
            Stop renting your audience. We design and build your own branded platform — age-verified, paywall-ready and as seductive as your work — so you keep the relationship and more of the revenue.
          </p>
        </Reveal>
      </div>

      {/* Packages */}
      <div className="gutter mt-14 grid gap-4 md:grid-cols-3">
        {packages.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.1}>
            <article className={`relative flex h-full flex-col rounded-md border p-7 md:p-8 ${paper} ${p.featured ? "border-brass bg-bottle" : "border-brass/20 bg-bottle/40"}`}>
              {p.featured && <span className="pill pill-TRENDING absolute -top-3 left-7">Most chosen</span>}
              <h3 className="font-bodoni text-3xl font-bold tracking-tight">{p.name}</h3>
              <p className="mt-2 text-sm text-parchment/75">{p.blurb}</p>
              <p className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-5xl font-light text-brass">{p.price}</span>
                <span className="text-xs uppercase tracking-[0.2em] text-parchment/60">{p.note}</span>
              </p>
              <div className="hairline my-6" />
              <ul className="grid gap-3 text-sm text-ivory/85">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-3">
                    <span className="text-brass">✦</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a href="#brief" className={`btn mt-8 ${p.featured ? "btn-wine" : "btn-brass"}`}>Start with {p.name}</a>
            </article>
          </Reveal>
        ))}
      </div>

      {/* Process */}
      <div className="gutter mt-20">
        <p className="label mb-8">The process</p>
        <ol className="relative grid gap-10 md:grid-cols-4 md:gap-6">
          <span className="hairline absolute left-0 right-0 top-[1.35rem] hidden md:block" aria-hidden />
          {steps.map(([n, t, d], i) => (
            <Reveal as="li" key={n} delay={i * 0.12} className="relative">
              <span className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full border border-brass bg-forest font-display text-lg italic text-brass">{n}</span>
              <h3 className="mt-5 font-display text-3xl">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-parchment/75">{d}</p>
            </Reveal>
          ))}
        </ol>
      </div>

      {/* Portfolio */}
      <div className="mt-20">
        <div className="gutter mb-2 flex items-end justify-between">
          <p className="label">Selected work · mock-ups</p>
        </div>
        <Rail label="Portfolio">
          {portfolio.map((w) => (
            <figure key={w.name} className="w-[80vw] shrink-0 snap-start sm:w-[55vw] md:w-[38vw]">
              <div className="overflow-hidden rounded-md border border-brass/25 bg-bottle">
                <div className="flex items-center gap-1.5 border-b border-brass/15 px-3 py-2">
                  {[0, 1, 2].map((d) => <span key={d} className="h-2 w-2 rounded-full bg-ivory/20" />)}
                  <span className="ml-3 truncate text-[0.65rem] text-parchment/50">{w.name.toLowerCase().replace(/ & | /g, "")}.com</span>
                </div>
                <div className="media aspect-[16/10] !rounded-none">
                  <div className="art">
                    <ArtFrame scene={w.scene} tone={w.tone} seed={w.name} alt={w.name} />
                  </div>
                  <div className="absolute inset-0 z-10 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent p-5">
                    <p className="font-display text-3xl italic">{w.name}</p>
                  </div>
                </div>
              </div>
            </figure>
          ))}
        </Rail>
      </div>

      {/* Testimonial + brief */}
      <div id="brief" className="gutter mt-20 grid scroll-mt-24 gap-12 lg:grid-cols-2">
        <Reveal>
          <blockquote className="font-display text-3xl font-light italic leading-snug md:text-4xl">
            &ldquo;My old link-in-bio felt like a flea market. Now I have a salon — and my subscribers stay twice as long.&rdquo;
          </blockquote>
          <p className="mt-6 text-sm uppercase tracking-[0.2em] text-brass">— Creator, Milano · Atelier client</p>
          <p className="mt-2 text-xs text-parchment/50">Placeholder testimonial</p>
        </Reveal>
        <Reveal delay={0.1}>
          {sent ? (
            <div className="rounded-md border border-brass/40 bg-bottle p-8">
              <p className="font-display text-3xl italic text-brass">Grazie — we&apos;ll reply within 48 hours.</p>
            </div>
          ) : (
            <form className={`grid gap-4 rounded-md border border-brass/25 bg-bottle/60 p-6 md:grid-cols-2 md:p-8 ${paper}`} onSubmit={async (e) => {
              e.preventDefault();
              const res = await post("/api/lead", { kind: "creator", ...Object.fromEntries(new FormData(e.currentTarget)) });
              if (!res.error) setSent(true);
            }}>
              <p className="font-display text-3xl md:col-span-2">Tell us about your brand</p>
              {[
                ["Name", "text", "name"],
                ["Email", "email", "email"],
                ["Your platform link", "url", "link"],
              ].map(([l, t, n]) => (
                <label key={n} className={`grid gap-2 text-xs uppercase tracking-[0.2em] text-parchment/70 ${n === "link" ? "md:col-span-2" : ""}`}>
                  {l}
                  <input name={n} type={t} required={n !== "link"} className="rounded-sm border border-ivory/20 bg-forest/70 px-4 py-3 text-sm normal-case tracking-normal text-ivory focus:border-brass focus:outline-none" />
                </label>
              ))}
              <label className="grid gap-2 text-xs uppercase tracking-[0.2em] text-parchment/70 md:col-span-2">
                Budget
                <select name="budget" className="rounded-sm border border-ivory/20 bg-forest/70 px-4 py-3 text-sm normal-case tracking-normal text-ivory focus:border-brass focus:outline-none">
                  <option>Starter · around €1,200</option>
                  <option>Atelier · around €3,400</option>
                  <option>Maison · €7,500+</option>
                  <option>Not sure yet</option>
                </select>
              </label>
              <label className="grid gap-2 text-xs uppercase tracking-[0.2em] text-parchment/70 md:col-span-2">
                Message
                <textarea name="message" rows={4} className="resize-none rounded-sm border border-ivory/20 bg-forest/70 px-4 py-3 text-sm normal-case tracking-normal text-ivory focus:border-brass focus:outline-none" />
              </label>
              <label className="flex items-start gap-3 text-xs leading-relaxed text-parchment/75 md:col-span-2">
                <input type="checkbox" required className="mt-0.5 h-4 w-4 accent-[var(--color-brass)]" />
                I am 18+ and agree to be contacted about my project.
              </label>
              <button className="btn btn-wine md:col-span-2">Send my brief</button>
            </form>
          )}
        </Reveal>
      </div>
    </div>
  );
}
