import { categories, collections, films, muses, shorts, stills } from "@/lib/data";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import SectionHead from "@/components/SectionHead";
import Rail from "@/components/Rail";
import CategoryCard from "@/components/CategoryCard";
import ReelCard from "@/components/ReelCard";
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

      <section id="categories" className="scroll-mt-20 pt-20 md:pt-28">
        <SectionHead eyebrow="Explore by mood" title="Top Categories" href="/browse" />
        <Rail label="Top categories">
          {categories.map((c) => (
            <CategoryCard key={c.slug} c={c} />
          ))}
        </Rail>
      </section>

      <section id="films" className="scroll-mt-20 pt-16 md:pt-24">
        <SectionHead eyebrow="Trending now" title="Now Showing" href="/browse?type=film" />
        <div className="gutter grid gap-3 sm:grid-cols-2 md:gap-4 xl:grid-cols-4">
          {films.map((r, i) => (
            <Reveal key={r.slug} delay={(i % 4) * 0.08}>
              <ReelCard reel={r} />
            </Reveal>
          ))}
        </div>
      </section>

      <section id="shorts" className="scroll-mt-20 pt-16 md:pt-24">
        <SectionHead eyebrow="Vertical · 9:16" title="Latest Shorts" pill="New" href="/shorts/" />
        <ShortsRail reels={shorts} />
      </section>

      <section id="images" className="scroll-mt-20 pt-16 md:pt-24">
        <SectionHead eyebrow="Stills from the studio" title="Trending Images" href="/images/" />
        <StillsGrid stills={stills.slice(0, 16)} />
      </section>

      <section id="collections" className="scroll-mt-20 pt-16 md:pt-24">
        <SectionHead eyebrow="Handpicked" title="Curated Collections">
          <p className="mt-3 max-w-md text-parchment/75">Hand-picked selections of our most cinematic work.</p>
        </SectionHead>
        <div className="gutter grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-4">
          {collections.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.08}>
              <CollectionTile c={c} />
            </Reveal>
          ))}
        </div>
      </section>

      <div className="pt-20 md:pt-28">
        <Marquee tone="wine" />
      </div>

      <section id="muses" className="scroll-mt-20 pt-20 md:pt-28">
        <SectionHead eyebrow="Le Muse" title="The muses shaping Lust Photography" href="/browse?type=muse">
          <p className="mt-4 max-w-2xl text-parchment/75">
            Our cast of AI-imagined characters — each with a story, a city and a signature mood. Every muse is a fictional adult, created in our studio.
          </p>
        </SectionHead>
        <div className="gutter grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 md:gap-x-4 lg:grid-cols-6">
          {muses.map((m, i) => (
            <Reveal key={m.slug} delay={(i % 6) * 0.06}>
              <MuseCard m={m} />
            </Reveal>
          ))}
        </div>
      </section>

      <section id="fantasies" className="scroll-mt-20 pt-24 md:pt-36">
        <Fantasies />
      </section>

      <section id="brands" className="relative mt-24 scroll-mt-20 border-t border-brass/15 pb-8 pt-20 md:mt-36 md:pt-28">
        <Brands />
      </section>

      <section id="creators" className="relative mt-24 scroll-mt-20 border-t border-brass/15 bg-[#0b1510] pb-24 pt-20 md:mt-36 md:pt-28">
        <Creators />
      </section>
    </>
  );
}
