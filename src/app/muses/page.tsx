import { muses } from "@/lib/data";
import MuseCard from "@/components/MuseCard";
import Reveal from "@/components/Reveal";
import PageHead from "@/components/PageHead";

export const metadata = { title: "Muses — Lust Photography" };

export default function MusesPage() {
  return (
    <div className="pb-24 pt-32 md:pt-44">
      <PageHead eyebrow="Le Muse" title="Muses" className="mb-12 md:mb-20">
        <p className="mt-5 text-lg leading-relaxed text-parchment/75">
          Each muse is a fictional adult character, created in our studio, with a world of her own — open a profile to see everything she appears in.
        </p>
      </PageHead>
      <div className="gutter grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3 md:gap-x-8 lg:grid-cols-4">
        {muses.map((m, i) => (
          <Reveal key={m.slug} delay={(i % 4) * 0.06}>
            <MuseCard m={m} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
