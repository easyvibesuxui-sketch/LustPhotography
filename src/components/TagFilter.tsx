"use client";

import { TAGS, type Tag } from "@/lib/data";

// Horizontal tag chips; `null` means "All".
export default function TagFilter({ active, onChange, counts, className = "" }: { active: Tag | null; onChange: (t: Tag | null) => void; counts?: Partial<Record<Tag, number>>; className?: string }) {
  const chip = (on: boolean) =>
    `shrink-0 rounded-full border px-4 py-2 font-ui text-sm font-semibold tracking-wide backdrop-blur transition ${on ? "border-brass bg-brass text-forest" : "border-ivory/20 bg-forest/60 text-ivory/90 hover:border-brass"}`;
  return (
    <div className={`rail flex gap-2 overflow-x-auto px-4 ${className}`} role="toolbar" aria-label="Filter by tag">
      <button className={chip(active === null)} onClick={() => onChange(null)} aria-pressed={active === null}>All</button>
      {TAGS.map((t) => (
        <button key={t} className={chip(active === t)} onClick={() => onChange(active === t ? null : t)} aria-pressed={active === t}>
          #{t}
          {counts?.[t] !== undefined && <span className="ml-1.5 opacity-60">{counts[t]}</span>}
        </button>
      ))}
    </div>
  );
}

// Keeps the chosen tag in ?tag= so filtered views can be shared.
export function readTag(): Tag | null {
  if (typeof window === "undefined") return null;
  const t = new URLSearchParams(location.search).get("tag");
  return (TAGS as readonly string[]).includes(t ?? "") ? (t as Tag) : null;
}

export function writeTag(t: Tag | null) {
  const u = new URL(location.href);
  if (t) u.searchParams.set("tag", t);
  else u.searchParams.delete("tag");
  history.replaceState(null, "", u);
}
