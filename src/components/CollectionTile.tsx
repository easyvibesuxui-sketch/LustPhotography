import Link from "next/link";
import type { Collection } from "@/lib/data";
import ArtFrame from "./ArtFrame";

export default function CollectionTile({ c }: { c: Collection }) {
  return (
    <Link href={`/browse?collection=${c.slug}`} className="media group block aspect-[4/5] md:aspect-square" data-cursor="Open">
      <div className="art sepia-[0.3] group-hover:scale-105 group-hover:sepia-0">
        <ArtFrame {...c} seed={c.slug} alt={c.title} />
      </div>
      <div className="scrim-b absolute inset-0 z-[3]" />
      <div className="absolute inset-x-0 bottom-0 z-10 p-5 md:p-6">
        <p className="font-display text-3xl font-light leading-none md:text-[2.4rem]">{c.title}</p>
        {c.subtitle && <p className="mt-2 font-display text-lg italic text-parchment/85">{c.subtitle}</p>}
      </div>
    </Link>
  );
}
