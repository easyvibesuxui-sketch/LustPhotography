import Link from "next/link";
import Reveal from "./Reveal";

export default function SectionHead({ eyebrow, title, pill, href, children }: { eyebrow?: string; title: string; pill?: string; href?: string; children?: React.ReactNode }) {
  return (
    <Reveal className="gutter mb-7 flex items-end justify-between gap-6">
      <div>
        {eyebrow && <p className="label mb-3">{eyebrow}</p>}
        <h2 className="flex flex-wrap items-center gap-3 font-display text-4xl font-light leading-none text-ivory md:text-6xl">
          {title}
          {pill && <span className="pill pill-wine translate-y-[-0.2em] text-[0.62rem]">{pill}</span>}
        </h2>
        {children}
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {href && (
          <Link href={href} className="group hidden items-center gap-2 text-sm font-semibold text-ivory/90 sm:flex">
            See all
            <span className="block h-px w-6 bg-brass transition-all duration-500 group-hover:w-10" />
          </Link>
        )}
      </div>
    </Reveal>
  );
}
