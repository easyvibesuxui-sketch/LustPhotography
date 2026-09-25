"use client";

import { useState } from "react";
import { brandPackages, brandWork } from "@/lib/data";
import { post } from "@/lib/auth";
import ArtFrame from "./ArtFrame";
import Rail from "./Rail";
import Reveal from "./Reveal";

const field = "rounded-sm border border-ivory/20 bg-forest/70 px-4 py-3 text-sm normal-case tracking-normal text-ivory focus:border-brass focus:outline-none";
const lbl = "grid gap-2 font-ui text-xs uppercase tracking-[0.18em] text-parchment/70";

export default function Brands() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    const res = await post("/api/lead", { kind: "brand", ...f });
    if (res.error) setError(res.error);
    else setSent(true);
  };

  return (
    <div>
      <div className="gutter grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
        <Reveal>
          <p className="label mb-4">For brands · AI photoshoots</p>
          <h2 className="font-hero text-5xl leading-[0.95] md:text-7xl">
            Your campaign, shot in <em className="text-brass">Tuscany.</em> No flights required.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="leading-relaxed text-parchment/80">
            Swimwear on the Amalfi coast, skincare in golden-hour light, wine in a candlelit cantina. We create cinematic, on-brand imagery
            with fictional AI models — faster and far cheaper than a location shoot.
          </p>
        </Reveal>
      </div>

      <div className="mt-12">
        <Rail label="Brand work">
          {brandWork.map((w) => (
            <figure key={w.name} className="w-[72vw] shrink-0 snap-start sm:w-[44vw] md:w-[30vw] lg:w-[23vw]">
              <div className="media aspect-[4/3]">
                <div className="art">
                  <ArtFrame scene="riviera" tone="sand" {...w} seed={w.name} alt={`${w.kind} concept`} />
                </div>
                <div className="scrim-b absolute inset-0 z-[3]" />
                <figcaption className="absolute inset-x-0 bottom-0 z-10 p-4">
                  <p className="label !text-[0.7rem]">{w.kind}</p>
                  <p className="font-display text-2xl">{w.name}</p>
                </figcaption>
              </div>
            </figure>
          ))}
        </Rail>
        <p className="gutter mt-2 text-xs text-parchment/50">Concept work · brand names are illustrative.</p>
      </div>

      <div className="gutter mt-14 grid gap-4 md:grid-cols-3">
        {brandPackages.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.1}>
            <article className={`relative flex h-full flex-col rounded-md border p-7 md:p-8 ${p.featured ? "border-brass bg-bottle" : "border-brass/20 bg-bottle/40"}`}>
              {p.featured && <span className="pill pill-TRENDING absolute -top-3 left-7">Most booked</span>}
              <h3 className="font-bodoni text-3xl font-bold tracking-tight">{p.name}</h3>
              <p className="mt-2 text-sm text-parchment/75">{p.blurb}</p>
              <p className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-5xl text-brass">{p.price}</span>
                <span className="font-ui text-sm uppercase tracking-[0.15em] text-parchment/60">{p.note}</span>
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
              <a href="#brand-brief" className={`btn mt-auto pt-4 ${p.featured ? "btn-wine" : "btn-brass"}`} style={{ marginTop: "2rem" }}>
                Book {p.name}
              </a>
            </article>
          </Reveal>
        ))}
      </div>

      <div id="brand-brief" className="gutter mt-16 grid scroll-mt-24 gap-12 lg:grid-cols-2">
        <Reveal>
          <p className="label mb-4">How it works</p>
          <ol className="grid gap-6">
            {[
              ["Brief", "Tell us your product, audience and the mood you want."],
              ["Moodboard", "We send a Tuscan-inspired moodboard and test frames within 48 hours."],
              ["Shoot", "We generate, retouch and grade every frame to our film look."],
              ["Deliver", "Final images and reels in every format your channels need."],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brass font-display text-lg italic text-brass">{i + 1}</span>
                <div>
                  <p className="font-display text-2xl">{t}</p>
                  <p className="text-sm text-parchment/75">{d}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-xs leading-relaxed text-parchment/50">
            All models are fictional and AI-generated; we never recreate real people. Brand work is always fully clothed and safe for every platform.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          {sent ? (
            <div className="rounded-md border border-brass/40 bg-bottle p-8">
              <p className="font-display text-3xl italic text-brass">Grazie — we&apos;ll send a moodboard within 48 hours.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="grid gap-4 rounded-md border border-brass/25 bg-bottle/60 p-6 md:grid-cols-2 md:p-8">
              <p className="font-display text-3xl md:col-span-2">Start a brand shoot</p>
              <label className={lbl}>Name<input name="name" required className={field} /></label>
              <label className={lbl}>Email<input name="email" type="email" required className={field} /></label>
              <label className={lbl}>Brand<input name="company" required className={field} /></label>
              <label className={lbl}>Website or Instagram<input name="link" className={field} /></label>
              <label className={`${lbl} md:col-span-2`}>
                Package
                <select name="budget" className={field}>
                  {brandPackages.map((p) => (
                    <option key={p.name}>{p.name} · {p.price}</option>
                  ))}
                  <option>Not sure yet</option>
                </select>
              </label>
              <label className={`${lbl} md:col-span-2`}>
                What are we shooting?
                <textarea name="message" rows={4} className={`${field} resize-none`} placeholder="Product, mood, where it will be used…" />
              </label>
              {error && <p className="text-sm text-wine-hot md:col-span-2" role="alert">{error}</p>}
              <button className="btn btn-wine md:col-span-2">Send brief</button>
            </form>
          )}
        </Reveal>
      </div>
    </div>
  );
}
