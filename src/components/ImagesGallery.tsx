"use client";

import { useEffect, useMemo, useState } from "react";
import { stills, TAGS, type Tag } from "@/lib/data";
import StillsGrid from "./StillsGrid";
import TagFilter, { readTag, tagsFor, writeTag } from "./TagFilter";
import { useMe } from "@/lib/auth";

export default function ImagesGallery() {
  const [tag, setTag] = useState<Tag | null>(null);
  const { me } = useMe();
  const tags = tagsFor(me?.tier);
  useEffect(() => setTag(readTag()), []);

  const list = useMemo(() => (tag ? stills.filter((s) => s.tags.includes(tag)) : stills), [tag]);
  const counts = useMemo(() => Object.fromEntries(TAGS.map((t) => [t, stills.filter((s) => s.tags.includes(t)).length])), []);

  const pick = (t: Tag | null) => {
    setTag(t);
    writeTag(t);
  };

  return (
    <>
      <div className="gutter mb-8">
        <p className="label mb-3">Stills from the studio</p>
        <h1 className="font-ui text-4xl font-bold uppercase leading-none md:text-6xl">Images</h1>
        <p className="mt-3 text-parchment/70">
          {list.length} {list.length === 1 ? "image" : "images"}
          {tag && <> tagged <span className="text-brass">#{tag}</span></>}
        </p>
      </div>
      <TagFilter tags={tags} active={tag} onChange={pick} counts={counts} className="mb-8 md:px-[var(--gutter)]" />
      <StillsGrid key={tag ?? "all"} stills={list} />
    </>
  );
}
