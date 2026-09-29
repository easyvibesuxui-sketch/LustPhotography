import Link from "next/link";
import { notFound } from "next/navigation";
import { collections, museBySlug, reels, stills } from "@/lib/data";
import ArtFrame from "@/components/ArtFrame";
import ReelCard, { FilmTile } from "@/components/ReelCard";
import StillsGrid from "@/components/StillsGrid";
import CollectionTile from "@/components/CollectionTile";
import Reveal from "@/components/Reveal";

export const generateStaticParams = () => collections.map((c) => ({ slug: c.slug }));

const bySlug = (slug: string) => collections.find((c) => c.slug === slug);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const c = bySlug((await params).slug);
  return { title: c ? `${c.title} — Lust Photography` : "Not found", description: c?.blurb };
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const c = bySlug((await params).slug);
  if (!c) notFound();
  const theirStills = stills.filter((s) => s.collection === c.slug);
  const theirFilms = reels.filter((r) => r.collection === c.slug && r.kind === "film");
  const theirShorts = reels.filter((r) => r.collection === c.slug && r.kind === "short");
  const cast = [...new Set([...theirStills.map((s) => s.muse), ...theirFilms.flatMap((r) => r.muses), ...theirShorts.flatMap((r) => r.muses)])]
    .map(museBySlug)
    .filter((m) => !!m);
  const i = collections.indexOf(c);
  const more = [1, 2, 3].map((d) => collections[(i + d) % collections.length]);
  const count = (slug: string) => stills.filter((s) => s.collection === slug).length + reels.filter((r) => r.collection === slug).length;

  return (
    <div className="pb-24">
      <section className="relative flex min-h-[78svh] items-end overflow-hidden pt-28">
        <div className="media absolute inset-0 !rounded-none" data-sfw>
          <div className="art">
            <ArtFrame {...c} seed={c.slug} alt="" />
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest via-forest/70 to-forest/10" />
        <div className="gutter relative z-10 w-full pb-14 md:pb-20">
          <nav aria-label="Breadcrumb" className="mb-6 font-ui text-sm font-semibold uppercase tracking-[0.2em] text-parchment/70">
            <Link href="/collections/" className="hover:text-brass">Collections</Link>
            <span className="mx-2 text-brass" aria-hidden>/</span>
            <span className="text-ivory">{c.title}</span>
          </nav>
          <h1 className="max-w-4xl font-display text-6xl font-light leading-[0.95] md:text-8xl">{c.title}</h1>
          {c.subtitle && <p className="mt-4 font-display text-2xl italic text-parchment md:text-3xl">{c.subtitle}</p>}
          {c.blurb && <p className="mt-6 max-w-2xl text-base leading-relaxed text-parchment/80 md:text-lg">{c.blurb}</p>}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="pill pill-ghost">{theirStills.length} images</span>
            {theirFilms.length + theirShorts.length > 0 && <span className="pill pill-ghost">{theirFilms.length + theirShorts.length} reels</span>}
            {cast.map((m) => (
              <Link key={m.slug} href={`/muse/${m.slug}/`} className="pill pill-wine hover:brightness-110">
                with {m.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {theirFilms.length > 0 && (
        <section className="pt-20 md:pt-28">
          <h2 className="gutter label mb-8">Films · {theirFilms.length}</h2>
          <div className="gutter grid gap-x-8 gap-y-14 sm:grid-cols-2 md:gap-x-10 lg:grid-cols-3">
            {theirFilms.map((r) => (
              <FilmTile key={r.slug} reel={r} />
            ))}
          </div>
        </section>
      )}

      {theirShorts.length > 0 && (
        <section className="pt-20 md:pt-28">
          <h2 className="gutter label mb-8">Shorts · {theirShorts.length}</h2>
          <div className="gutter grid grid-cols-2 gap-5 sm:grid-cols-3 md:gap-8 lg:grid-cols-4">
            {theirShorts.map((r) => (
              <ReelCard key={r.slug} reel={r} />
            ))}
          </div>
        </section>
      )}

      {theirStills.length > 0 && (
        <section className="pt-20 md:pt-28">
          <h2 className="gutter label mb-8">Images · {theirStills.length}</h2>
          <StillsGrid stills={theirStills} page={24} />
        </section>
      )}

      <section className="pt-28 md:pt-40">
        <Reveal className="gutter mb-10 flex items-end justify-between gap-6 md:mb-14">
          <h2 className="font-ui text-3xl font-bold uppercase leading-none md:text-5xl">More collections</h2>
          <Link href="/collections/" className="font-ui text-base font-semibold text-ivory/90 hover:text-brass">
            All collections →
          </Link>
        </Reveal>
        <div className="gutter grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {more.map((m) => (
            <CollectionTile key={m.slug} c={m} count={count(m.slug)} />
          ))}
        </div>
      </section>
    </div>
  );
}
