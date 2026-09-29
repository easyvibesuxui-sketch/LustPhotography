"use client";

import { useState } from "react";
import type { Still } from "@/lib/data";
import StillsGrid from "./StillsGrid";

// A stills grid with one row of chips to narrow it down (e.g. a muse's images by collection).
export default function FilteredStills({ stills, groups }: { stills: Still[]; groups: { key: string; label: string }[] }) {
  const [on, setOn] = useState<string | null>(null);
  const list = on ? stills.filter((s) => s.collection === on) : stills;
  const chip = (active: boolean) => `shrink-0 rounded-full border px-4 py-2 text-sm transition ${active ? "border-brass bg-brass text-forest" : "border-ivory/15 hover:border-brass"}`;
  return (
    <>
      {groups.length > 1 && (
        <div className="gutter rail mb-8 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter images">
          <button className={chip(!on)} aria-pressed={!on} onClick={() => setOn(null)}>All · {stills.length}</button>
          {groups.map((g) => (
            <button key={g.key} className={chip(on === g.key)} aria-pressed={on === g.key} onClick={() => setOn(on === g.key ? null : g.key)}>
              {g.label} · {stills.filter((s) => s.collection === g.key).length}
            </button>
          ))}
        </div>
      )}
      <StillsGrid key={on ?? "all"} stills={list} page={24} />
    </>
  );
}
