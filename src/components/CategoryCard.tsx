import Link from "next/link";
import type { Category } from "@/lib/data";
import ArtFrame from "./ArtFrame";

const wash: Record<string, string> = {
  wine: "from-[#5a1e1c]/80",
  dusk: "from-[#2b3a4a]/80",
  terracotta: "from-[#8a4a2e]/80",
  sand: "from-[#8c7358]/80",
  olive: "from-[#3e4a2a]/80",
  noir: "from-[#15120f]/85",
  forest: "from-[#1a2e22]/85",
};

export default function CategoryCard({ c }: { c: Category }) {
  return (
    <Link href={`/browse?category=${c.slug}`} className="media group block aspect-[4/3] w-[72vw] shrink-0 snap-start sm:w-[44vw] md:w-[31vw] lg:w-[23.5vw]" data-cursor="Explore">
      <div className="art group-hover:scale-105">
        <ArtFrame {...c} seed={c.slug} alt={c.title} />
      </div>
      <div className={`absolute inset-0 z-[3] bg-gradient-to-t ${wash[c.tone]} via-transparent to-transparent transition-opacity duration-700 group-hover:opacity-60`} />
      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center pb-6">
        <p className="font-display text-3xl font-light tracking-tight md:text-4xl">{c.title}</p>
        <span className="mt-2 block h-px w-0 bg-brass transition-all duration-700 ease-[var(--ease-film)] group-hover:w-24" />
      </div>
    </Link>
  );
}
