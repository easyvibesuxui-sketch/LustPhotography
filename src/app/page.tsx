import { categories, collections, films, muses, reels, shorts, stills } from "@/lib/data";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import SectionHead from "@/components/SectionHead";
import Rail from "@/components/Rail";
import CategoryCard from "@/components/CategoryCard";
import { FilmTile } from "@/components/ReelCard";
import ShortsRail from "@/components/ShortsRail";
import StillsGrid from "@/components/StillsGrid";
import CollectionTile from "@/components/CollectionTile";
import MuseCard from "@/components/MuseCard";
import Fantasies from "@/components/Fantasies";
import Creators from "@/components/Creators";
import Brands from "@/components/Brands";
import Reveal from "@/components/Reveal";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />

      <section id="categories" className="scroll-mt-20 pt-28 md:pt-44">
        <SectionHead eyebrow="Explore by mood" title="Top Categories" href="/browse" />
        <Rail label="Top categories">
          {categories.map((c) => (
            <CategoryCard key={c.slug} c={c} />
          ))}
        </Rail>
      </section>

      <section id="films" className="scroll-mt-20 pt-28 md:pt-44">
        <SectionHead eyebrow="Trending now" title="Now Showing" href="/browse?type=film" />
        <div className="gutter grid gap-x-8 gap-y-14 sm:grid-cols-2 md:gap-x-10 md:gap-y-16 lg:grid-cols-3">
          {films.map((r, i) => (
            <Reveal key={r.slug} delay={(i % 3) * 0.08}>
              <FilmTile reel={r} />
            </Reveal>
          ))}
        </div>
      </section>

      <section id="shorts" className="scroll-mt-20 pt-28 md:pt-44">
        <SectionHead eyebrow="Vertical · 9:16" title="Latest Shorts" pill="New" href="/shorts/" />
        <ShortsRail reels={shorts} />
      </section>

      <section id="images" className="scroll-mt-20 pt-28 md:pt-44">
        <SectionHead eyebrow="Stills from the studio" title="Trending Images" href="/images/" />
        <StillsGrid stills={stills.slice(0, 16)} />
      </section>

      <section id="collections" className="scroll-mt-20 pt-28 md:pt-44">
        <SectionHead eyebrow="Grouped by setting" title="Collections" href="/collections/">
          <p className="mt-3 max-w-md text-parchment/75">The dacha, the banya, the promenade — every set in one place.</p>
        </SectionHead>
        <div className="gutter grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {collections.slice(0, 6).map((c, i) => (
            <Reveal key={c.slug} delay={(i % 3) * 0.08}>
              <CollectionTile c={c} count={stills.filter((s) => s.collection === c.slug).length + reels.filter((r) => r.collection === c.slug).length} />
            </Reveal>
          ))}
        </div>
      </section>

      <div className="pt-28 md:pt-44">
        <Marquee tone="wine" />
      </div>

      <section id="muses" className="scroll-mt-20 pt-28 md:pt-44">
        <SectionHead eyebrow="Le Muse" title="The muses shaping Lust Photography" href="/muses/">
          <p className="mt-4 max-w-2xl text-parchment/75">
            Our cast of AI-imagined characters — each with a story, a city and a signature mood. Every muse is a fictional adult, created in our studio.
          </p>
        </SectionHead>
        <div className="gutter grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3 md:gap-x-8 lg:grid-cols-6">
          {muses.map((m, i) => (
            <Reveal key={m.slug} delay={(i % 6) * 0.06}>
              <MuseCard m={m} />
            </Reveal>
          ))}
        </div>
      </section>

      <section id="fantasies" className="scroll-mt-20 pt-28 md:pt-44">
        <Fantasies />
      </section>

      <section id="brands" className="relative mt-28 scroll-mt-20 border-t border-brass/15 pb-8 pt-20 md:mt-44 md:pt-28">
        <Brands />
      </section>

      <section id="creators" className="relative mt-28 scroll-mt-20 border-t border-brass/15 bg-[#0b1510] pb-24 pt-20 md:mt-44 md:pt-28">
        <Creators />
      </section>
    </>
  );
}
