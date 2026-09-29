import { collections, reels, stills } from "@/lib/data";
import CollectionTile from "@/components/CollectionTile";
import Reveal from "@/components/Reveal";
import PageHead from "@/components/PageHead";

export const metadata = { title: "Collections — Lust Photography" };

export default function CollectionsPage() {
  const count = (slug: string) => stills.filter((s) => s.collection === slug).length + reels.filter((r) => r.collection === slug).length;
  return (
    <div className="pb-24 pt-32 md:pt-44">
      <PageHead eyebrow="Grouped by setting" title="Collections" className="mb-12 md:mb-20">
        <p className="mt-5 text-lg leading-relaxed text-parchment/75">
          Every image and reel lives in the place it was shot — the dacha, the banya, the promenade — so each collection reads like one story.
        </p>
      </PageHead>
      <div className="gutter grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
        {collections.map((c, i) => (
          <Reveal key={c.slug} delay={(i % 3) * 0.08}>
            <CollectionTile c={c} count={count(c.slug)} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
