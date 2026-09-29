import Link from "next/link";
import { notFound } from "next/navigation";
import { collections, museBySlug, muses, reels, stills } from "@/lib/data";
import ArtFrame from "@/components/ArtFrame";
import ReelCard from "@/components/ReelCard";
import FilteredStills from "@/components/FilteredStills";
import CollectionTile from "@/components/CollectionTile";
import MuseCard from "@/components/MuseCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import SubNav from "@/components/SubNav";
import PrevNext from "@/components/PrevNext";
import Reveal, { SplitText } from "@/components/Reveal";

export const generateStaticParams = () => muses.map((m) => ({ slug: m.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const m = museBySlug((await params).slug);
  return { title: m ? `${m.name} — Lust Photography` : "Not found", description: m?.bio };
}

const sectionHead = "gutter mb-8 flex items-baseline justify-between gap-6 md:mb-12";
const h2 = "font-ui text-3xl font-bold uppercase leading-none md:text-5xl";

export default async function MusePage({ params }: { params: Promise<{ slug: string }> }) {
  const m = museBySlug((await params).slug);
  if (!m) notFound();
  const theirReels = reels.filter((r) => r.muses.includes(m.slug));
  const theirStills = stills.filter((s) => s.muse === m.slug);
  const theirCollections = collections.filter((c) => theirStills.some((s) => s.collection === c.slug) || theirReels.some((r) => r.collection === c.slug));
  const count = (slug: string) => stills.filter((s) => s.collection === slug).length + reels.filter((r) => r.collection === slug).length;
  const i = muses.indexOf(m);
  const prev = muses[(i - 1 + muses.length) % muses.length];
  const next = muses[(i + 1) % muses.length];
  const others = muses.filter((x) => x.slug !== m.slug).slice(0, 6);

  const sections = [
    theirReels.length > 0 && { id: "reels", label: "Reels", count: theirReels.length },
    theirStills.length > 0 && { id: "stills", label: "Images", count: theirStills.length },
    theirCollections.length > 0 && { id: "collections", label: "Collections", count: theirCollections.length },
    { id: "more-muses", label: "Other muses" },
  ].filter((s) => !!s);

  return (
    <div className="pb-24">
      <section className="relative grid min-h-[88svh] items-end overflow-hidden pt-24 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div className="absolute inset-0 opacity-40 blur-2xl lg:hidden">
          <ArtFrame {...m} seed={`${m.slug}-bg`} />
        </div>
        <div className="gutter relative z-10 order-2 pb-16 lg:order-1 lg:pb-0">
          <Breadcrumbs trail={[["Home", "/"], ["Muses", "/muses/"], [m.name]]} className="mb-8" />
          <p className="label mb-4">AI Muse · {m.from}</p>
          <h1 className="font-hero leading-[0.9] tracking-[-0.02em]" style={{ fontSize: "clamp(3.2rem, 8vw, 8.5rem)" }}>
            <SplitText text={m.name} delay={0.2} />
          </h1>
          <Reveal delay={0.5}>
            <p className="mt-6 max-w-md font-display text-2xl italic leading-snug text-parchment">{m.bio}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {m.tags.map((t) => (
                <span key={t} className="pill pill-ghost">{t}</span>
              ))}
            </div>
            <dl className="mt-8 flex gap-10">
              {[
                ["Reels", theirReels.length],
                ["Images", theirStills.length],
                ["Collections", theirCollections.length],
              ].map(([k, v]) => (
                <div key={k}>
                  <dd className="font-display text-4xl font-light">{v}</dd>
                  <dt className="font-ui text-xs font-semibold uppercase tracking-[0.2em] text-parchment/60">{k}</dt>
                </div>
              ))}
            </dl>
            <p className="mt-8 text-xs text-parchment/50">A fictional adult character created by the Lust Photography studio.</p>
          </Reveal>
        </div>
        <div className="relative order-1 hidden h-full min-h-[88svh] lg:order-2 lg:block">
          <div className="media absolute inset-y-24 left-0 right-[var(--gutter)]" data-sfw>
            <div className="art animate-[kenburns_20s_ease-in-out_infinite_alternate]">
              <ArtFrame {...m} seed={m.slug} alt={m.name} />
            </div>
          </div>
        </div>
      </section>

      <SubNav label={`${m.name} sections`} items={sections} />

      {theirReels.length > 0 && (
        <section id="reels" className="scroll-mt-36 pt-20 md:pt-28">
          <div className={sectionHead}>
            <h2 className={h2}>Reels</h2>
            <span className="text-parchment/60">{theirReels.length}</span>
          </div>
          <div className="gutter grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-8">
            {theirReels.map((r) => (
              <ReelCard key={r.slug} reel={r} className={r.kind === "film" ? "col-span-2" : ""} />
            ))}
          </div>
        </section>
      )}

      {theirStills.length > 0 && (
        <section id="stills" className="scroll-mt-36 pt-20 md:pt-28">
          <div className={sectionHead}>
            <h2 className={h2}>Images</h2>
            <span className="text-parchment/60">{theirStills.length}</span>
          </div>
          <FilteredStills stills={theirStills} groups={theirCollections.map((c) => ({ key: c.slug, label: c.title }))} />
        </section>
      )}

      {theirCollections.length > 0 && (
        <section id="collections" className="scroll-mt-36 pt-20 md:pt-28">
          <div className={sectionHead}>
            <h2 className={h2}>Appears in</h2>
            <Link href="/collections/" className="font-ui font-semibold text-ivory/90 hover:text-brass">All collections →</Link>
          </div>
          <div className="gutter grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {theirCollections.map((c) => (
              <CollectionTile key={c.slug} c={c} count={count(c.slug)} />
            ))}
          </div>
        </section>
      )}

      <section id="more-muses" className="scroll-mt-36 pt-20 md:pt-28">
        <div className={sectionHead}>
          <h2 className={h2}>Other muses</h2>
          <Link href="/muses/" className="font-ui font-semibold text-ivory/90 hover:text-brass">All muses →</Link>
        </div>
        <div className="gutter grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3 md:gap-x-8 lg:grid-cols-6">
          {others.map((o) => (
            <MuseCard key={o.slug} m={o} />
          ))}
        </div>
      </section>

      <PrevNext noun="muse" prev={{ href: `/muse/${prev.slug}/`, title: prev.name }} next={{ href: `/muse/${next.slug}/`, title: next.name }} />
    </div>
  );
}
