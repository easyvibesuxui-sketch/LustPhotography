import Link from "next/link";
import type { Muse } from "@/lib/data";
import ArtFrame from "./ArtFrame";

export default function MuseCard({ m }: { m: Muse }) {
  return (
    <Link href={`/muse/${m.slug}`} className="group block" data-cursor="Meet">
      <div className="media aspect-[4/5]">
        <div className="art sepia-[0.7] saturate-[0.7] group-hover:scale-105 group-hover:sepia-0 group-hover:saturate-100">
          <ArtFrame {...m} seed={m.slug} alt={m.name} />
        </div>
        <span className="pill pill-ghost absolute left-2.5 top-2.5 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100">AI Muse</span>
      </div>
      <p className="mt-3 text-center font-display text-xl">{m.name}</p>
      <p className="text-center text-[0.65rem] uppercase tracking-[0.25em] text-parchment/60">{m.from}</p>
    </Link>
  );
}
