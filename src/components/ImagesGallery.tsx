"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { collections, stills, TAGS, type Tag } from "@/lib/data";
import StillsGrid from "./StillsGrid";
import PageHead from "./PageHead";
import TagFilter, { readTag, tagsFor, writeTag } from "./TagFilter";
import { useMe } from "@/lib/auth";

// Rendered in pages so a large archive doesn't mount hundreds of tiles at once.
const PAGE = 48;

export default function ImagesGallery() {
  const [tag, setTag] = useState<Tag | null>(null);
  const [shown, setShown] = useState(PAGE);
  const { me } = useMe();
  const tags = tagsFor(me?.tier);
  useEffect(() => setTag(readTag()), []);

  const list = useMemo(() => (tag ? stills.filter((s) => s.tags.includes(tag)) : stills), [tag]);
  const counts = useMemo(() => Object.fromEntries(TAGS.map((t) => [t, stills.filter((s) => s.tags.includes(t)).length])), []);

  const pick = (t: Tag | null) => {
    setTag(t);
    setShown(PAGE);
    writeTag(t);
  };

  return (
    <>
      <PageHead eyebrow="Stills from the studio" title="Images" className="mb-8">
        <p className="mt-3 text-parchment/70">
          {list.length} {list.length === 1 ? "image" : "images"}
          {tag && <> tagged <span className="text-brass">#{tag}</span></>}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="font-ui text-xs font-semibold uppercase tracking-[0.2em] text-parchment/60">By collection:</span>
          {collections.map((c) => (
            <Link key={c.slug} href={`/collection/${c.slug}/#images`} className="rounded-full border border-ivory/15 px-3 py-1.5 text-xs text-parchment transition hover:border-brass hover:text-ivory">
              {c.title}
            </Link>
          ))}
        </div>
      </PageHead>
      <TagFilter tags={tags} active={tag} onChange={pick} counts={counts} className="mb-8 md:px-[var(--gutter)]" />
      <StillsGrid key={tag ?? "all"} stills={list.slice(0, shown)} />
      {shown < list.length && (
        <div className="mt-12 flex justify-center">
          <button className="btn btn-brass" onClick={() => setShown((n) => n + PAGE)}>
            Show more · {list.length - shown}
          </button>
        </div>
      )}
    </>
  );
}
