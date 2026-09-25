import type { Lockup } from "@/lib/data";

// Film-poster typographic lockups: each title gets its own voice.
export default function PosterTitle({ title, lockup, size = "md" }: { title: string; lockup: Lockup; size?: "md" | "lg" }) {
  const k = size === "lg" ? 1.9 : 1;
  const px = (n: number) => `calc(${n * k}rem + ${n * k * 0.4}vw)`;
  switch (lockup) {
    case "bodoni":
      return (
        <div className="leading-[0.86]">
          <div className="font-bodoni font-black uppercase tracking-tight" style={{ fontSize: px(1.35) }}>{title}</div>
          <div className="mt-2 flex items-center gap-2 text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-parchment">
            Directed by <span className="font-script text-base normal-case tracking-normal text-ivory">Lust Photography</span>
          </div>
        </div>
      );
    case "italiana":
      return (
        <div>
          <div className="font-poster uppercase tracking-[0.12em]" style={{ fontSize: px(1.3) }}>{title}</div>
          <div className="mt-1 text-[0.6rem] uppercase tracking-[0.35em] text-brass">A Lust Photography film</div>
        </div>
      );
    case "script":
      return (
        <div>
          <div className="font-script leading-none text-ivory" style={{ fontSize: px(1.7) }}>{title}</div>
          <div className="mt-1 text-[0.6rem] font-bold uppercase tracking-[0.3em] text-parchment">Movie compilation</div>
        </div>
      );
    case "condensed":
      return (
        <div className="leading-[0.85]">
          <div className="font-condensed uppercase tracking-wide" style={{ fontSize: px(1.9) }}>{title}</div>
          <div className="text-[0.6rem] font-bold uppercase tracking-[0.3em] text-brass">Scene compilation</div>
        </div>
      );
    case "the": {
      const [first, ...rest] = title.split(" ");
      return (
        <div className="leading-none">
          <div className="mb-1 text-[0.72rem] font-semibold uppercase tracking-[0.45em] text-brass">{first}</div>
          <div className="font-display font-light italic" style={{ fontSize: px(1.35) }}>{rest.join(" ")}</div>
        </div>
      );
    }
    case "italic":
    default:
      return <div className="font-display font-medium italic leading-tight" style={{ fontSize: px(1.2) }}>{title}</div>;
  }
}
