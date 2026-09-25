import type { Lockup } from "@/lib/data";

// Film-poster typographic lockups: each title gets its own face and colour,
// like the one-sheets on the reference site.
export default function PosterTitle({ title, lockup, size = "md" }: { title: string; lockup: Lockup; size?: "md" | "lg" }) {
  const k = size === "lg" ? 1.9 : 1;
  const px = (n: number) => `calc(${n * k}rem + ${n * k * 0.4}vw)`;
  const sub = "mt-1.5 font-ui text-[0.72rem] font-semibold uppercase tracking-[0.18em]";
  const shadow = { textShadow: "0 2px 18px rgba(0,0,0,0.55)" };
  switch (lockup) {
    case "bodoni":
      return (
        <div className="leading-[0.86]" style={shadow}>
          <div className="font-bodoni font-black uppercase tracking-tight text-ivory" style={{ fontSize: px(1.45) }}>{title}</div>
          <div className={`${sub} flex items-center gap-2 text-parchment`}>
            Directed by <span className="font-script text-lg normal-case tracking-normal text-ivory">Lust Photography</span>
          </div>
        </div>
      );
    case "marker":
      return (
        <div style={shadow}>
          <div className="font-marker uppercase leading-[0.95] text-limone" style={{ fontSize: px(1.55) }}>{title}</div>
          <div className={`font-marker text-[0.7rem] uppercase tracking-[0.08em] text-limone/90`}>A Tuscan fantasy</div>
        </div>
      );
    case "bungee":
      return (
        <div style={{ textShadow: "3px 3px 0 #1d3b14" }}>
          <div className="font-bungee uppercase leading-[0.95] text-verde" style={{ fontSize: px(1.05) }}>{title}</div>
          <div className="mt-1 font-bungee text-[0.6rem] uppercase tracking-[0.1em] text-verde/90">Directed by Lust Photography</div>
        </div>
      );
    case "anton":
      return (
        <div className="leading-[0.9]" style={shadow}>
          <div className="font-anton uppercase tracking-tight text-ivory" style={{ fontSize: px(1.6) }}>{title}</div>
          <div className={`${sub} text-aperol`}>Scene compilation</div>
        </div>
      );
    case "shrikhand":
      return (
        <div style={{ textShadow: "0 3px 0 rgba(90,20,40,0.55), 0 2px 20px rgba(0,0,0,0.5)" }}>
          <div className="font-shrikhand leading-[0.95] text-rosa" style={{ fontSize: px(1.35) }}>{title}</div>
          <div className={`${sub} text-rosa/90`}>Directed by <span className="font-script text-lg normal-case tracking-normal">Lust Photography</span></div>
        </div>
      );
    case "tall":
      return (
        <div style={shadow}>
          <div className="font-shoulders font-light uppercase leading-[0.85] tracking-tight text-brass" style={{ fontSize: px(2.1) }}>{title}</div>
          <div className={`${sub} flex items-center gap-2 text-parchment`}>
            Directed by <span className="font-script text-lg normal-case tracking-normal text-ivory">Lust Photography</span>
          </div>
        </div>
      );
    case "josefin":
      return (
        <div style={shadow}>
          <div className="font-josefin font-extralight uppercase tracking-[0.04em] text-ivory" style={{ fontSize: px(1.45) }}>{title}</div>
          <div className="mt-1 font-josefin text-[0.72rem] text-parchment">Directed by, Lust Photography</div>
        </div>
      );
    case "italiana":
      return (
        <div style={shadow}>
          <div className="font-poster uppercase tracking-[0.12em] text-lilla" style={{ fontSize: px(1.3) }}>{title}</div>
          <div className={`${sub} text-brass`}>A Lust Photography film</div>
        </div>
      );
    case "script":
      return (
        <div style={shadow}>
          <div className="font-script leading-none text-ivory" style={{ fontSize: px(1.7) }}>{title}</div>
          <div className={`${sub} text-parchment`}>Movie compilation</div>
        </div>
      );
    case "condensed":
      return (
        <div className="leading-[0.85]" style={shadow}>
          <div className="font-condensed uppercase tracking-wide" style={{ fontSize: px(1.9) }}>{title}</div>
          <div className={`${sub} text-brass`}>Scene compilation</div>
        </div>
      );
    case "the": {
      const [first, ...rest] = title.split(" ");
      return (
        <div className="leading-none" style={shadow}>
          <div className="mb-1 font-ui text-[0.8rem] font-semibold uppercase tracking-[0.4em] text-cielo">{first}</div>
          <div className="font-display text-cielo" style={{ fontSize: px(1.75) }}>{rest.join(" ")}</div>
          <div className={`${sub} text-ivory/80`}>A summer of lust</div>
        </div>
      );
    }
    case "italic":
    default:
      return <div className="font-display italic leading-tight" style={{ fontSize: px(1.3), ...shadow }}>{title}</div>;
  }
}
