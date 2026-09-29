import Link from "next/link";

type Step = { href: string; title: string };

// Walk sideways to the neighbouring muse / collection without going back to the index.
export default function PrevNext({ prev, next, noun }: { prev: Step; next: Step; noun: string }) {
  const cell = "group flex flex-col gap-2 border-t border-brass/20 py-8 transition-colors hover:border-brass";
  return (
    <nav aria-label={`More ${noun}s`} className="gutter grid gap-6 pt-24 sm:grid-cols-2 md:pt-32">
      <Link href={prev.href} className={cell}>
        <span className="font-ui text-xs font-semibold uppercase tracking-[0.2em] text-parchment/60">← Previous {noun}</span>
        <span className="font-display text-3xl font-light group-hover:text-brass md:text-4xl">{prev.title}</span>
      </Link>
      <Link href={next.href} className={`${cell} sm:items-end sm:text-right`}>
        <span className="font-ui text-xs font-semibold uppercase tracking-[0.2em] text-parchment/60">Next {noun} →</span>
        <span className="font-display text-3xl font-light group-hover:text-brass md:text-4xl">{next.title}</span>
      </Link>
    </nav>
  );
}
