import Link from "next/link";
import { notFound } from "next/navigation";
import { categoryBySlug, museBySlug, reelBySlug, reels } from "@/lib/data";
import Player from "@/components/Player";
import Rail from "@/components/Rail";
import ReelCard from "@/components/ReelCard";

export const generateStaticParams = () => reels.map((r) => ({ slug: r.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const r = reelBySlug((await params).slug);
  return { title: r ? `${r.title} — Lust Photography` : "Not found" };
}

export default async function Watch({ params }: { params: Promise<{ slug: string }> }) {
  const reel = reelBySlug((await params).slug);
  if (!reel) notFound();
  const cat = categoryBySlug(reel.category);
  const more = reels.filter((r) => r.slug !== reel.slug && r.kind === reel.kind).sort((a) => (a.category === reel.category ? -1 : 1));

  return (
    <div className="pt-24 md:pt-28">
      <Player reel={reel} />

      <div className="gutter mt-14 grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-20">
        <div>
          <h1 className="font-ui text-4xl font-semibold leading-[1.02] md:text-6xl">{reel.tagline}</h1>
          {reel.fantasy && (
            <p className="mt-5 flex flex-wrap items-center gap-2 text-sm text-parchment/70">
              Based on <span className="pill pill-ghost">{reel.fantasy.title}</span> a fantasy by <span className="text-ivory">@{reel.fantasy.by}</span>
            </p>
          )}
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ivory/85">{reel.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {reel.tags.map((t) => (
              <Link key={t} href={`/browse?q=${encodeURIComponent(t)}`} className="rounded-full border border-ivory/15 px-3 py-1.5 text-xs text-parchment hover:border-brass">
                #{t}
              </Link>
            ))}
          </div>
        </div>
        <dl className="grid content-start gap-4 border-t border-brass/20 pt-6 text-sm lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <div>
            <dt className="text-parchment/60">Directed by</dt>
            <dd className="font-script text-3xl text-ivory">{reel.director}</dd>
          </div>
          <div>
            <dt className="text-parchment/60">Starring</dt>
            <dd className="mt-1 flex flex-wrap gap-x-3">
              {reel.muses.map((s) => {
                const m = museBySlug(s);
                return m ? (
                  <Link key={s} href={`/muse/${s}`} className="font-display text-xl text-ivory underline decoration-brass/50 underline-offset-4 hover:text-brass">
                    {m.name}
                  </Link>
                ) : null;
              })}
            </dd>
          </div>
          <div className="flex gap-8">
            <div>
              <dt className="text-parchment/60">Rating</dt>
              <dd className="font-display text-2xl">★ {reel.rating.toFixed(1)}</dd>
            </div>
            <div>
              <dt className="text-parchment/60">Duration</dt>
              <dd className="font-display text-2xl">{reel.duration}</dd>
            </div>
          </div>
          {cat && (
            <div>
              <dt className="text-parchment/60">Category</dt>
              <dd>
                <Link href={`/browse?category=${cat.slug}`} className="font-display text-xl hover:text-brass">{cat.title}</Link>
              </dd>
            </div>
          )}
          <p className="text-xs text-parchment/50">AI-generated. All characters are fictional adults.</p>
        </dl>
      </div>

      <section className="pt-20">
        <h2 className="gutter mb-2 font-display text-4xl font-light">More like this</h2>
        <Rail label="More like this">
          {more.map((r) => (
            <ReelCard key={r.slug} reel={r} className={r.kind === "short" ? "w-[46vw] sm:w-[30vw] md:w-[21vw] lg:w-[16.5vw]" : "w-[80vw] sm:w-[46vw] lg:w-[31vw]"} />
          ))}
        </Rail>
      </section>
    </div>
  );
}
