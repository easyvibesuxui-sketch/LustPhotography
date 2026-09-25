"use client";

import { useState } from "react";
import type { Reel } from "@/lib/data";
import Rail from "./Rail";
import ReelCard from "./ReelCard";
import ReelViewer from "./ReelViewer";

export default function ShortsRail({ reels }: { reels: Reel[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <>
      <Rail label="Latest shorts">
        {reels.map((r, i) => (
          <ReelCard key={r.slug} reel={r} variant="short" onOpen={() => setOpen(i)} className="w-[46vw] sm:w-[30vw] md:w-[21vw] lg:w-[16.5vw]" />
        ))}
      </Rail>
      {open !== null && <ReelViewer reels={reels} start={open} onClose={() => setOpen(null)} />}
    </>
  );
}
