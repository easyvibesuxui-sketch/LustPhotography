"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { categories, collections, muses, reels, stills, museBySlug } from "@/lib/data";
import ReelCard, { FilmTile } from "./ReelCard";
import StillsGrid from "./StillsGrid";
import MuseCard from "./MuseCard";
import PageHead from "./PageHead";

const types = [
  ["all", "Everything"],
  ["film", "Films"],
  ["short", "Shorts"],
  ["image", "Images"],
  ["muse", "Muses"],
] as const;

const sorts = [
  ["trending", "Trending"],
  ["newest", "Newest"],
  ["top", "Top rated"],
] as const;

export default function Browse() {
  const params = useSearchParams();
  const router = useRouter();
  const type = params.get("type") ?? "all";
  const category = params.get("category") ?? "";
  const collection = params.get("collection") ?? "";
  const q = (params.get("q") ?? "").toLowerCase();
  const sort = params.get("sort") ?? "trending";

  const set = (k: string, v: string) => {
    const p = new URLSearchParams(params.toString());
    if (v) p.set(k, v);
    else p.delete(k);
    router.replace(`/browse?${p.toString()}`, { scroll: false });
  };

  // Focus the search box on desktop only: on phones it would pop the keyboard over the page.
  const search = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches) search.current?.focus();
  }, []);

  const match = (s: string) => !q || s.toLowerCase().includes(q);

  const list = useMemo(() => {
    const r = reels.filter(
      (x) =>
        (type === "all" || type === x.kind) &&
        (!category || x.category === category) &&
        (!collection || x.collection === collection) &&
        match([x.title, x.tagline, x.tags.join(" "), x.muses.map((m) => museBySlug(m)?.name).join(" ")].join(" ")),
    );
    const score = (x: (typeof r)[number]) =>
      sort === "top" ? x.rating : sort === "newest" ? (x.badges.includes("NEW") ? 2 : 0) : (x.badges.includes("TRENDING") ? 2 : 0) + x.rating / 10;
    return r.sort((a, b) => score(b) - score(a));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, category, collection, q, sort]);

  const imgs = stills.filter((s) => (type === "all" || type === "image") && (!collection || s.collection === collection) && (!category || s.category === category) && match(s.title + " " + museBySlug(s.muse)?.name));
  const people = muses.filter((m) => (type === "all" || type === "muse") && !category && !collection && match(m.name + " " + m.tags.join(" ") + " " + m.from));
  const films = list.filter((r) => r.kind === "film");
  const shorts = list.filter((r) => r.kind === "short");
  const heading = categories.find((c) => c.slug === category)?.title ?? collections.find((c) => c.slug === collection)?.title ?? "Browse";

  const chip = (on: boolean) => `shrink-0 rounded-full border px-4 py-2 text-sm transition ${on ? "border-brass bg-brass text-forest" : "border-ivory/15 hover:border-brass"}`;
  const empty = !films.length && !shorts.length && !imgs.length && !people.length;

  return (
    <div>
      <PageHead eyebrow="The archive" title={heading}>
        <label className="mt-8 flex max-w-xl items-center gap-3 border-b border-brass/40 pb-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-brass" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <span className="sr-only">Search</span>
          <input
            defaultValue={params.get("q") ?? ""}
            onChange={(e) => set("q", e.target.value)}
            placeholder="Search reels, muses, moods…"
            className="w-full bg-transparent font-display text-2xl italic placeholder:text-parchment/40 focus:outline-none"
            ref={search}
            type="search"
          />
        </label>
      </PageHead>

      <div className="gutter rail mt-8 flex gap-2 overflow-x-auto pb-1">
        {types.map(([v, l]) => (
          <button key={v} className={chip(type === v)} onClick={() => set("type", v === "all" ? "" : v)} aria-pressed={type === v}>{l}</button>
        ))}
        <span className="mx-2 w-px shrink-0 bg-brass/30" />
        {sorts.map(([v, l]) => (
          <button key={v} className={chip(sort === v)} onClick={() => set("sort", v === "trending" ? "" : v)} aria-pressed={sort === v}>{l}</button>
        ))}
      </div>
      <div className="gutter rail mt-3 flex gap-2 overflow-x-auto pb-1">
        <button className={chip(!category && !collection)} onClick={() => router.replace(`/browse${type !== "all" ? `?type=${type}` : ""}`, { scroll: false })}>All moods</button>
        {categories.map((c) => (
          <button key={c.slug} className={chip(category === c.slug)} onClick={() => set("category", category === c.slug ? "" : c.slug)}>{c.title}</button>
        ))}
        {collections.map((c) => (
          <button key={c.slug} className={chip(collection === c.slug)} onClick={() => set("collection", collection === c.slug ? "" : c.slug)}>
            <em className="font-display text-base">{c.title}</em>
          </button>
        ))}
      </div>

      {empty && <p className="gutter mt-20 font-display text-3xl italic text-parchment/70">Nothing here yet — try another mood.</p>}

      {films.length > 0 && (
        <section className="mt-12">
          <h2 className="gutter label mb-4">Films · {films.length}</h2>
          <div className="gutter grid gap-x-8 gap-y-14 sm:grid-cols-2 md:gap-x-10 md:gap-y-16 lg:grid-cols-3">
            {films.map((r) => <FilmTile key={r.slug} reel={r} />)}
          </div>
        </section>
      )}
      {shorts.length > 0 && (
        <section className="mt-12">
          <h2 className="gutter label mb-4">Shorts · {shorts.length}</h2>
          <div className="gutter grid grid-cols-2 gap-5 sm:grid-cols-3 md:gap-8 lg:grid-cols-4">
            {shorts.map((r) => <ReelCard key={r.slug} reel={r} />)}
          </div>
        </section>
      )}
      {imgs.length > 0 && (
        <section className="mt-12">
          <h2 className="gutter label mb-4">Images · {imgs.length}</h2>
          <StillsGrid key={`${category}-${collection}-${q}`} stills={imgs} page={24} />
        </section>
      )}
      {people.length > 0 && (
        <section className="mt-12">
          <h2 className="gutter label mb-4">Muses · {people.length}</h2>
          <div className="gutter grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
            {people.map((m) => <MuseCard key={m.slug} m={m} />)}
          </div>
        </section>
      )}
    </div>
  );
}
