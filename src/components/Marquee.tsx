const words = ["Amore", "Desiderio", "Estate", "Segreto", "Passione", "Dolce Vita", "Lussuria", "Notte"];

export default function Marquee({ tone = "brass" }: { tone?: "brass" | "wine" }) {
  const row = [...words, ...words];
  return (
    <div className={`relative overflow-hidden border-y py-5 ${tone === "wine" ? "border-wine/40 bg-wine/10" : "border-brass/25"}`} aria-hidden>
      <div className="marquee-track flex w-max gap-10 whitespace-nowrap">
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-10 font-display text-3xl italic text-parchment/80 md:text-5xl">
            {w}
            <span className="text-base not-italic text-brass">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
