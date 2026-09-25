"use client";

import { useEffect, useMemo, useState } from "react";
import { shorts, TAGS, type Tag } from "@/lib/data";
import ReelViewer from "./ReelViewer";
import TagFilter, { readTag, tagsFor, writeTag } from "./TagFilter";
import { useMe } from "@/lib/auth";

export default function ShortsFeed() {
  const [tag, setTag] = useState<Tag | null>(null);
  const { me } = useMe();
  const tags = tagsFor(me?.tier);
  useEffect(() => setTag(readTag()), []);

  const list = useMemo(() => (tag ? shorts.filter((r) => r.tags.includes(tag)) : shorts), [tag]);
  const counts = useMemo(() => Object.fromEntries(TAGS.map((t) => [t, shorts.filter((r) => r.tags.includes(t)).length])), []);

  const pick = (t: Tag | null) => {
    setTag(t);
    writeTag(t);
  };

  return (
    <>
      <h1 className="sr-only">Lust Shorts</h1>
      <ReelViewer key={tag ?? "all"} reels={list} start={0} top={<TagFilter tags={tags} active={tag} onChange={pick} counts={counts} />} />
    </>
  );
}
