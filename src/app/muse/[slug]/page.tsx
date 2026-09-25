import { notFound } from "next/navigation";
import { museBySlug, muses, reels, stills } from "@/lib/data";
import ArtFrame from "@/components/ArtFrame";
import ReelCard from "@/components/ReelCard";
import StillsGrid from "@/components/StillsGrid";
import Reveal, { SplitText } from "@/components/Reveal";

export const generateStaticParams = () => muses.map((m) => ({ slug: m.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const m = museBySlug((await params).slug);
  return { title: m ? `${m.name} — Lust Photography` : "Not found" };
}

export default async function MusePage({ params }: { params: Promise<{ slug: string }> }) {
  const m = museBySlug((await params).slug);
  if (!m) notFound();
  const theirReels = reels.filter((r) => r.muses.includes(m.slug));
  const theirStills = stills.filter((s) => s.muse === m.slug);

  return (
    <div>
      <section className="relative grid min-h-[92svh] items-end overflow-hidden pt-24 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div className="absolute inset-0 opacity-40 blur-2xl lg:hidden">
          <ArtFrame {...m} seed={`${m.slug}-bg`} />
        </div>
        <div className="gutter relative z-10 order-2 pb-16 lg:order-1 lg:pb-0">
          <p className="label mb-4">AI Muse · {m.from}</p>
          <h1 className="font-display font-light leading-[0.88] tracking-[-0.02em]" style={{ fontSize: "clamp(3.2rem, 8vw, 8.5rem)" }}>
            <SplitText text={m.name} delay={0.2} />
          </h1>
          <Reveal delay={0.5}>
            <p className="mt-6 max-w-md font-display text-2xl italic leading-snug text-parchment">{m.bio}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {m.tags.map((t) => (
                <span key={t} className="pill pill-ghost">{t}</span>
              ))}
            </div>
            <p className="mt-8 text-xs text-parchment/50">A fictional adult character created by the Lust Photography studio.</p>
          </Reveal>
        </div>
        <div className="relative order-1 hidden h-full min-h-[92svh] lg:order-2 lg:block">
          <div className="media absolute inset-y-24 left-0 right-[var(--gutter)]" data-revealed="true">
            <div className="art animate-[kenburns_20s_ease-in-out_infinite_alternate]">
              <ArtFrame {...m} seed={m.slug} alt={m.name} />
            </div>
          </div>
        </div>
      </section>

      {theirReels.length > 0 && (
        <section className="pt-10">
          <h2 className="gutter mb-6 font-display text-4xl font-light md:text-5xl">Reels with {m.name.split(" ")[0]}</h2>
          <div className="gutter grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {theirReels.map((r) => (
              <ReelCard key={r.slug} reel={r} className={r.kind === "film" ? "col-span-2" : ""} />
            ))}
          </div>
        </section>
      )}

      {theirStills.length > 0 && (
        <section className="pt-20">
          <h2 className="gutter mb-6 font-display text-4xl font-light md:text-5xl">Stills</h2>
          <StillsGrid stills={theirStills} />
        </section>
      )}
    </div>
  );
}
