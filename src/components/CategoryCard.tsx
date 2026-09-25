import Link from "next/link";
import type { Category } from "@/lib/data";
import ArtFrame from "./ArtFrame";

// Coloured washes per mood, like the tinted category tiles on the reference.
const wash: Record<string, string> = {
  "villa-nights": "#c77a86",
  "riviera-summer": "#5f86ad",
  "vintage-romance": "#c4734a",
  "golden-hour": "#c9a24f",
  "linen-silk": "#a58fc9",
  "noir-italiano": "#4b4f58",
};

export default function CategoryCard({ c }: { c: Category }) {
  return (
    <Link href={`/browse?category=${c.slug}`} className="media group block aspect-[4/3] w-[72vw] shrink-0 snap-start sm:w-[44vw] md:w-[31vw] lg:w-[23.5vw]" data-cursor="Explore">
      <div className="art group-hover:scale-105">
        <ArtFrame {...c} seed={c.slug} alt={c.title} />
      </div>
      <div className="absolute inset-0 z-[3] opacity-45 mix-blend-color transition-opacity duration-700 group-hover:opacity-20" style={{ background: wash[c.slug] }} />
      <div className="absolute inset-0 z-[3] transition-opacity duration-700 group-hover:opacity-70" style={{ background: `linear-gradient(to top, ${wash[c.slug]}f2 0%, ${wash[c.slug]}66 38%, transparent 70%)` }} />
      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center pb-6">
        <p className="font-display text-4xl leading-none tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)] md:text-5xl">{c.title}</p>
        <span className="mt-2 block h-px w-0 bg-brass transition-all duration-700 ease-[var(--ease-film)] group-hover:w-24" />
      </div>
    </Link>
  );
}
